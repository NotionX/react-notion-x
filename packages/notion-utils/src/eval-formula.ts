import * as types from 'notion-types'
import {
  format,
  getDate,
  getDay,
  getHours,
  getMinutes,
  getMonth,
  getYear,
  add,
  sub,
  intervalToDuration
} from 'date-fns'

import { getTextContent } from './get-text-content'
import { getDateValue } from './get-date-value'

export interface EvalFormulaOptions {
  properties: types.PropertyMap
  schema: types.CollectionPropertySchemaMap

  endDate?: boolean
}

/**
 * Evaluates a Notion formula expression to a result value.
 *
 * All built-in functions and operators are supported.
 *
 * @param formula - Formula to evaluate.
 * @param options - Collection context containing property schema and values.
 */
export function evalFormula(
  formula: types.Formula,
  options: EvalFormulaOptions
): types.FormulaResult {
  const { endDate, ...opts } = options

  // TODO: coerce return type using `formula.return_type`
  switch (formula?.type) {
    case 'constant':
      return formula.value

    case 'property':
      const value = opts.properties[formula.id]
      const text = getTextContent(value)

      switch (formula.result_type) {
        case 'text':
          return text

        case 'number':
          return parseFloat(text)

        case 'boolean':
          // TODO: handle chceckbox properties
          if (typeof text === 'string') {
            return text === 'true'
          } else {
            return !!text
          }

        case 'date':
          // console.log('date', text, value)

          const v = getDateValue(value)
          if (v) {
            if (endDate && v.end_date) {
              return new Date(v.end_date)
            } else {
              return new Date(v.start_date)
            }
          } else {
            return new Date(text)
          }

        default:
          return text
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

/**
 * Evaluates a Notion formula function or operator expression.
 *
 * Note that all operators are also exposed as functions, so we handle them the same.
 *
 * @private
 */
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

    case 'format': {
      const value = evalFormula(args[0], opts)

      switch (typeof value) {
        case 'string':
          return value

        case 'object':
          if (value instanceof Date) {
            return format(value as Date, 'MMM d, YYY')
          } else {
            // shouldn't ever get here
            return `${value}`
          }

        case 'number':
        default:
          return `${value}`
      }
    }

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
      return value.replace(new RegExp(regex, 'g'), replacement)
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
      return getDate(evalFormula(args[0], opts) as Date)

    case 'dateAdd': {
      const date = evalFormula(args[0], opts) as Date
      const number = evalFormula(args[1], opts) as number
      const unit = evalFormula(args[1], opts) as string
      return add(date, { [unit]: number })
    }

    case 'dateBetween': {
      const date1 = evalFormula(args[0], opts) as Date
      const date2 = evalFormula(args[1], opts) as Date
      const unit = evalFormula(args[1], opts) as string
      return (intervalToDuration({
        start: date2,
        end: date1
      }) as any)[unit] as number
    }

    case 'dateSubtract':
      const date = evalFormula(args[0], opts) as Date
      const number = evalFormula(args[1], opts) as number
      const unit = evalFormula(args[1], opts) as string
      return sub(date, { [unit]: number })

    case 'day':
      return getDay(evalFormula(args[0], opts) as Date)

    case 'end':
      return evalFormula(args[0], { ...opts, endDate: true }) as Date

    case 'formatDate': {
      const date = evalFormula(args[0], opts) as Date
      const formatValue = evalFormula(args[1], opts) as string
      return format(date, formatValue)
    }

    case 'fromTimestamp':
      return new Date(evalFormula(args[0], opts) as number)

    case 'hour':
      return getHours(evalFormula(args[0], opts) as Date)

    case 'minute':
      return getMinutes(evalFormula(args[0], opts) as Date)

    case 'month':
      return getMonth(evalFormula(args[0], opts) as Date)

    case 'now':
      return new Date()

    case 'start':
      return evalFormula(args[0], { ...opts, endDate: false }) as Date

    case 'timestamp':
      return (evalFormula(args[0], opts) as Date).getTime()

    case 'year':
      return getYear(evalFormula(args[0], opts) as Date)

    default:
      throw new Error(
        `invalid or unsupported function formula "${(formula as any)?.type}`
      )
  }
}
