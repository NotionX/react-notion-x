//^^ Imported from https://github.com/fpapado/react-lazy-images/
//^^ Edited by mustaqimarifin https://github.com/mustaqimarifin

import { Component } from 'react'
import { InView } from 'react-intersection-observer'
import { ofType, unionize, type UnionOf } from 'unionize'

/**
 * Valid props for LazyImage components
 */
export type CommonLazyImageProps = ImageProps & {
  // NOTE: if you add props here, remember to destructure them out of being
  // passed to the children, in the render() callback.

  /** Whether to skip checking for viewport and always show the 'actual' component
   * @see https://github.com/fpapado/react-lazy-images/#eager-loading--server-side-rendering-ssr
   */
  loadEagerly?: boolean

  /** Subset of props for the IntersectionObserver
   * @see https://github.com/thebuilder/react-intersection-observer#props
   */
  observerProps?: ObserverProps

  /** Use the Image Decode API;
   * The call to a new HTML <img> element’s decode() function returns a promise, which,
   * when fulfilled, ensures that the image can be appended to the DOM without causing
   * a decoding delay on the next frame.
   *  @see: https://www.chromestatus.com/feature/5637156160667648
   */
  experimentalDecode?: boolean

  /** Whether to log out internal state transitions for the component */
  debugActions?: boolean

  /** Delay a certain duration before starting to load, in ms.
   * This can help avoid loading images while the user scrolls quickly past them.
   * TODO: naming things.
   */
  debounceDurationMs?: number
}

/** Valid props for LazyImageFull */
export interface LazyImageFullProps extends CommonLazyImageProps {
  /** Children should be either a function or a node */
  children: (args: RenderCallbackArgs) => React.ReactNode
}

/** Values that the render props take */
export interface RenderCallbackArgs {
  imageState: ImageState
  imageProps: ImageProps
  /** When not loading eagerly, a ref to bind to the DOM element. This is needed for the intersection calculation to work. */
  ref?: React.RefObject<any> | ((node?: Element | null) => void)
}

export interface ImageProps {
  /** The source of the image to load */
  src: string

  /** The source set of the image to load */
  srcSet?: string

  /** The alt text description of the image you are loading */
  alt?: string

  /** Sizes descriptor */
  sizes?: string
}

/** Subset of react-intersection-observer's props */
export interface ObserverProps {
  /**
   * Margin around the root that expands the area for intersection.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin
   * @default "50px 0px"
   * @example Declaration same as CSS margin:
   *  `"10px 20px 30px 40px"` (top, right, bottom, left).
   */
  rootMargin?: string

  /** Number between 0 and 1 indicating the the percentage that should be
   * visible before triggering.
   * @default `0.01`
   */
  threshold?: number
}

/** States that the image loading can be in.
 * Used together with LazyImageFull render props.
 * External representation of the internal state.
 * */
export enum ImageState {
  NotAsked = 'NotAsked',
  Loading = 'Loading',
  LoadSuccess = 'LoadSuccess',
  LoadError = 'LoadError'
}

/** The component's state */
const LazyImageFullState = unionize({
  NotAsked: {},
  Buffering: {},
  // Could try to make it Promise<HTMLImageElement>,
  // but we don't use the element anyway, and we cache promises
  Loading: {},
  LoadSuccess: {},
  LoadError: ofType<{ msg: string }>()
})

type LazyImageFullState = UnionOf<typeof LazyImageFullState>

/** Actions that change the component's state.
 * These are not unlike Actions in Redux or, the ones I'm inspired by,
 * Msg in Elm.
 */
const Action = unionize({
  ViewChanged: ofType<{ inView: boolean }>(),
  BufferingEnded: {},
  // MAYBE: Load: {},
  LoadSuccess: {},
  LoadError: ofType<{ msg: string }>()
})

type Action = UnionOf<typeof Action>

/** Commands (Cmd) describe side-effects as functions that take the instance */
// FUTURE: These should be tied to giving back a Msg / asynchronoulsy giving a Msg with conditions
type Cmd = (instance: LazyImageFull) => void

/** The output from a reducer is the next state and maybe a command */
type ReducerResult = {
  nextState: LazyImageFullState
  cmd?: Cmd
}

///// Commands, things that perform side-effects /////
/** Get a command that sets a buffering Promise */
const getBufferingCmd =
  (durationMs: number): Cmd =>
  (instance) => {
    // Make cancelable buffering Promise
    const bufferingPromise = makeCancelable(delayedPromise(durationMs))

    // Kick off promise chain
    bufferingPromise.promise
      .then(() => instance.update(Action.BufferingEnded()))
      .catch(
        (_err) => {}
        //console.log({ isCanceled: _reason.isCanceled })
      )

    // Side-effect; set the promise in the cache
    instance.promiseCache.buffering = bufferingPromise
  }

/** Get a command that sets an image loading Promise */
const getLoadingCmd =
  (imageProps: ImageProps, experimentalDecode?: boolean): Cmd =>
  (instance) => {
    // Make cancelable loading Promise
    const loadingPromise = makeCancelable(
      loadImage(imageProps, experimentalDecode)
    )

    // Kick off request for Image and attach listeners for response
    loadingPromise.promise
      .then((_res) => instance.update(Action.LoadSuccess({})))
      .catch((err) => {
        // If the Loading Promise was canceled, it means we have stopped
        // loading due to unmount, rather than an error.
        if (!err.isCanceled) {
          //@ts-expect-error No need for changing structure
          instance.update(new Action.LoadError({ msg: 'LoadError' }))
        }
      })

    // Side-effect; set the promise in the cache
    instance.promiseCache.loading = loadingPromise
  }

/** Command that cancels the buffering Promise */
const cancelBufferingCmd: Cmd = (instance) => {
  // Side-effect; cancel the promise in the cache
  // We know this exists if we are in a Buffering state
  instance.promiseCache.buffering?.cancel()
}

/**
 * Component that preloads the image once it is in the viewport,
 * and then swaps it in. Takes a render prop that allows to specify
 * what is rendered based on the loading state.
 */
export class LazyImageFull extends Component<
  LazyImageFullProps,
  LazyImageFullState
> {
  static displayName = 'LazyImageFull'

  /** A central place to store promises.
   * A bit silly, but passing promises directly in the state
   * was giving me weird timing issues. This way we can keep
   * the promises in check, and pick them up from the respective methods.
   * FUTURE: Could pass the relevant key in Buffering and Loading, so
   * that at least we know where they are from a single source.
   */
  promiseCache: {
    [key: string]: CancelablePromise
  } = {}

  initialState = LazyImageFullState.NotAsked()

  /** Emit the next state based on actions.
   *  This is the core of the component!
   */
  static reducer(
    action: Action,
    prevState: LazyImageFullState,
    props: LazyImageFullProps
  ): ReducerResult {
    return Action.match(action, {
      ViewChanged: ({ inView }) => {
        if (inView === true) {
          // If src is not specified, then there is nothing to preload; skip to Loaded state
          if (!props.src) {
            return { nextState: LazyImageFullState.LoadSuccess() } // Error wtf
          } else {
            // If in view, only load something if NotAsked, otherwise leave untouched
            return LazyImageFullState.match(prevState, {
              NotAsked: () => {
                // If debounce is specified, then start buffering
                if (props.debounceDurationMs) {
                  return {
                    nextState: LazyImageFullState.Buffering(),
                    cmd: getBufferingCmd(props.debounceDurationMs)
                  }
                } else {
                  // If no debounce is specified, then start loading immediately
                  return {
                    nextState: LazyImageFullState.Loading(),
                    cmd: getLoadingCmd(props, props.experimentalDecode)
                  }
                }
              },
              // Do nothing in other states
              default: () => ({ nextState: prevState })
            })
          }
        } else {
          // If out of view, cancel if Buffering, otherwise leave untouched
          return LazyImageFullState.match(prevState, {
            Buffering: () => ({
              nextState: LazyImageFullState.NotAsked(),
              cmd: cancelBufferingCmd
            }),
            // Do nothing in other states
            default: () => ({ nextState: prevState })
          })
        }
      },
      // Buffering has ended/succeeded, kick off request for image
      BufferingEnded: () => ({
        nextState: LazyImageFullState.Loading(),
        cmd: getLoadingCmd(props, props.experimentalDecode)
      }),
      // Loading the image succeeded, simple
      LoadSuccess: () => ({ nextState: LazyImageFullState.LoadSuccess() }),
      //@ts-expect-error No need for changing structure
      LoadError: (e) => ({ nextState: new LazyImageFullState.LoadError(e) })
    })
  }

  constructor(props: LazyImageFullProps) {
    super(props)
    this.state = this.initialState

    // Bind methods
    this.update = this.update.bind(this)
  }

  update(action: Action) {
    // Get the next state and any effects
    const { nextState, cmd } = LazyImageFull.reducer(
      action,
      this.state,
      this.props
    )

    // Debugging
    if (this.props.debugActions) {
      if (process.env.NODE_ENV === 'production') {
        console.warn(
          'You are running LazyImage with debugActions="true" in production. This might have performance implications.'
        )
      }
      console.log({ action, prevState: this.state, nextState })
    }

    // Actually set the state, and kick off any effects after that
    this.setState(nextState, () => cmd && cmd(this))
  }

  override componentWillUnmount() {
    // Clear the Promise Cache
    if (this.promiseCache.loading) {
      // NOTE: This does not cancel the request, only the callback.
      // We we would need fetch() and an AbortHandler for that.
      this.promiseCache.loading.cancel()
    }
    if (this.promiseCache.buffering) {
      this.promiseCache.buffering.cancel()
    }
    this.promiseCache = {}
  }

  // Render function
  override render() {
    // This destructuring is silly
    const { children, loadEagerly, observerProps, ...imageProps } = this.props

    if (loadEagerly) {
      // If eager, skip the observer and view changing stuff; resolve the imageState as loaded.
      return children({
        // We know that the state tags and the enum match up
        imageState: LazyImageFullState.LoadSuccess().tag as ImageState,
        imageProps
      })
    } else {
      return (
        <InView
          rootMargin='50px 0px'
          // TODO: reconsider threshold
          threshold={0.01}
          {...observerProps}
          onChange={(inView: boolean) =>
            this.update(Action.ViewChanged({ inView }))
          }
        >
          {({ ref }: RenderProps) =>
            children({
              // We know that the state tags and the enum match up, apart
              // from Buffering not being exposed
              imageState:
                this.state.tag === 'Buffering'
                  ? ImageState.Loading
                  : (this.state.tag as ImageState),
              imageProps,
              ref
            })
          }
        </InView>
      )
    }
  }
}

interface RenderProps {
  inView: boolean
  entry: IntersectionObserverEntry | undefined
  ref: React.RefObject<any> | ((node?: Element | null) => void)
}

///// Utilities /////

/** Promise constructor for loading an image */
const loadImage = (
  { src, srcSet, alt, sizes }: ImageProps,
  experimentalDecode = false
) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    if (srcSet) {
      image.srcset = srcSet
    }
    if (alt) {
      image.alt = alt
    }
    if (sizes) {
      image.sizes = sizes
    }
    image.src = src

    /** @see: https://www.chromestatus.com/feature/5637156160667648 */
    if (experimentalDecode && 'decode' in image) {
      return image
        .decode()
        .then(() => resolve(image))
        .catch((err: any) => reject(err))
    }

    image.addEventListener('load', resolve)
    image.addEventListener = reject
  })

/** Promise that resolves after a specified number of ms */
const delayedPromise = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

interface CancelablePromise {
  promise: Promise<any>
  cancel: () => void
}

/** Make a Promise "cancelable".
 *
 * Rejects with {isCanceled: true} if canceled.
 *
 * The way this works is by wrapping it with internal hasCanceled_ state
 * and checking it before resolving.
 */
const makeCancelable = (promise: Promise<any>): CancelablePromise => {
  let hasCanceled_ = false

  const wrappedPromise = new Promise<any>((resolve, reject) => {
    void promise.then((val: any) =>
      hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)
    )
    promise.catch((err: any) =>
      hasCanceled_ ? reject({ isCanceled: true }) : reject(err)
    )
  })

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true
    }
  }
}
