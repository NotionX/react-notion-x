import * as types from 'notion-types'
import * as dates from 'date-fns'

import { getTextContent } from './get-text-content'

export interface EvalFormulaOptions {
  properties: types.PropertyMap
  schema: types.CollectionPropertySchemaMap
}

export function evalFormula(
  formula: types.Formula,
  opts: EvalFormulaOptions
): types.FormulaResult {
  // TODO: coerce return type using `formula.return_type`
  switch (formula?.type) {
    case 'constant':
      return formula.value

    case 'property':
      const value = getTextContent(opts.properties[formula.id])

      switch (formula.result_type) {
        case 'text':
          return value

        case 'number':
          return parseFloat(value)

        case 'boolean':
          // TODO: handle chceckbox properties
          if (typeof value === 'string') {
            return value === 'true'
          } else {
            return !!value
          }

        case 'date':
          return new Date(value)

        default:
          return value
      }

    case 'operator':
    // All operators are exposed as functions, so we handle them the same

    case 'function':
      return evalFunctionFormula(formula, opts)

    default:
      throw new Error(
        `invalid or unsupported formula "${(formula as any)?.type}`
      )
  }
}

function evalFunctionFormula(
  formula: types.FunctionFormula | types.OperatorFormula,
  opts: EvalFormulaOptions
): types.FormulaResult {
  const args = formula?.args

  switch (formula.name) {
    // logic
    // ------------------------------------------------------------------------

    case 'and':
      return evalFormula(args[0], opts) && evalFormula(args[1], opts)

    case 'empty':
      return !evalFormula(args[0], opts)

    case 'equal':
      return evalFormula(args[0], opts) == evalFormula(args[1], opts)

    case 'if':
      return evalFormula(args[0], opts)
        ? evalFormula(args[1], opts)
        : evalFormula(args[2], opts)

    case 'larger':
      return evalFormula(args[0], opts) > evalFormula(args[1], opts)

    case 'largerEq':
      return evalFormula(args[0], opts) >= evalFormula(args[1], opts)

    case 'not':
      return !evalFormula(args[0], opts)

    case 'or':
      return evalFormula(args[0], opts) || evalFormula(args[1], opts)

    case 'smaller':
      return evalFormula(args[0], opts) < evalFormula(args[1], opts)

    case 'smallerEq':
      return evalFormula(args[0], opts) <= evalFormula(args[1], opts)

    case 'unequal':
      return evalFormula(args[0], opts) != evalFormula(args[1], opts)

    // numeric
    // ------------------------------------------------------------------------

    case 'abs':
      return Math.abs(evalFormula(args[0], opts) as number)

    case 'add':
      return (
        (evalFormula(args[0], opts) as number) +
        (evalFormula(args[1], opts) as number)
      )

    case 'cbrt':
      return Math.cbrt(evalFormula(args[0], opts) as number)

    case 'ceil':
      return Math.ceil(evalFormula(args[0], opts) as number)

    case 'divide':
      return (
        (evalFormula(args[0], opts) as number) /
        (evalFormula(args[1], opts) as number)
      )

    case 'exp':
      return Math.exp(evalFormula(args[0], opts) as number)

    case 'floor':
      return Math.floor(evalFormula(args[0], opts) as number)

    case 'ln':
      return Math.log(evalFormula(args[0], opts) as number)

    case 'log10':
      return Math.log10(evalFormula(args[0], opts) as number)

    case 'log2':
      return Math.log2(evalFormula(args[0], opts) as number)

    case 'max':
      const values = args.map((arg) => evalFormula(arg, opts) as number)
      return values.reduce(
        (acc, value) => Math.max(acc, value),
        Number.NEGATIVE_INFINITY
      )

    case 'min': {
      const values = args.map((arg) => evalFormula(arg, opts) as number)
      return values.reduce(
        (acc, value) => Math.min(acc, value),
        Number.POSITIVE_INFINITY
      )
    }

    case 'mod':
      return (
        (evalFormula(args[0], opts) as number) %
        (evalFormula(args[1], opts) as number)
      )

    case 'multiply':
      return (
        (evalFormula(args[0], opts) as number) *
        (evalFormula(args[1], opts) as number)
      )

    case 'pow':
      return Math.pow(
        evalFormula(args[0], opts) as number,
        evalFormula(args[1], opts) as number
      )

    case 'round':
      return Math.round(evalFormula(args[0], opts) as number)

    case 'sign':
      return Math.sign(evalFormula(args[0], opts) as number)

    case 'sqrt':
      return Math.sqrt(evalFormula(args[0], opts) as number)

    case 'subtract':
      return (
        (evalFormula(args[0], opts) as number) -
        (evalFormula(args[1], opts) as number)
      )

    case 'toNumber':
      return parseFloat(evalFormula(args[0], opts) as string)

    case 'unaryMinus':
      return (evalFormula(args[0], opts) as number) * -1

    case 'unaryPlus':
      return parseFloat(evalFormula(args[0], opts) as string)

    // text
    // ------------------------------------------------------------------------

    case 'concat': {
      const values = args.map((arg) => evalFormula(arg, opts) as number)
      return values.join('')
    }

    case 'contains':
      return (evalFormula(args[0], opts) as string).includes(
        evalFormula(args[1], opts) as string
      )

    case 'format':
      return `${evalFormula(args[0], opts)}`

    case 'join': {
      const [delimiterArg, ...restArgs] = args
      const delimiter = evalFormula(delimiterArg, opts) as string
      const values = restArgs.map((arg) => evalFormula(arg, opts) as number)
      return values.join(delimiter)
    }

    case 'length':
      return (evalFormula(args[0], opts) as string).length

    case 'replace':
      const value = evalFormula(args[0], opts) as string
      const regex = evalFormula(args[1], opts) as string
      const replacement = evalFormula(args[2], opts) as string
      return value.replace(new RegExp(regex), replacement)

    case 'replaceAll': {
      const value = evalFormula(args[0], opts) as string
      const regex = evalFormula(args[1], opts) as string
      const replacement = evalFormula(args[2], opts) as string
      return value.replaceAll(new RegExp(regex), replacement)
    }

    case 'slice': {
      const value = evalFormula(args[0], opts) as string
      const beginIndex = evalFormula(args[1], opts) as number
      const endIndex = args[2]
        ? (evalFormula(args[2], opts) as number)
        : value.length
      return value.slice(beginIndex, endIndex)
    }

    case 'test': {
      const value = evalFormula(args[0], opts) as string
      const regex = evalFormula(args[1], opts) as string
      return new RegExp(regex).test(value)
    }

    // date & time
    // ------------------------------------------------------------------------

    case 'date':
      return dates.getDate(evalFormula(args[0], opts) as Date)

    case 'dateAdd': {
      const date = evalFormula(args[0], opts) as Date
      const number = evalFormula(args[1], opts) as number
      const unit = evalFormula(args[1], opts) as string
      return dates.add(date, { [unit]: number })
    }

    case 'dateBetween': {
      const date1 = evalFormula(args[0], opts) as Date
      const date2 = evalFormula(args[1], opts) as Date
      const unit = evalFormula(args[1], opts) as string
      return (dates.intervalToDuration({
        start: date2,
        end: date1
      }) as any)[unit] as number
    }

    case 'dateSubtract':
      return true

    case 'day':
      return true

    case 'end':
      return true

    case 'formatDate':
      return true

    case 'fromTimestamp':
      return true

    case 'hour':
      return true

    case 'minute':
      return true

    case 'month':
      return true

    case 'now':
      return true

    case 'start':
      return true

    case 'timestamp':
      return true

    case 'year':
      return true

    default:
      throw new Error(
        `invalid or unsupported function formula "${(formula as any)?.type}`
      )
  }
}
