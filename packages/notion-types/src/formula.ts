import { PropertyID } from './core'

// @see https://www.notion.vip/formulas/

export type FormulaType =
  | 'constant'
  | 'property'
  | 'operator'
  | 'function'
  | 'symbol'

export type FormulaConstantType = 'e' | 'false' | 'true' | 'pi'

export type FormulaValueType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | FormulaConstantType

export type FormulaResult = string | number | boolean | Date
export type FormulaResultType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'date'
  | 'checkbox'

export type FormulaOperatorType =
  // arithmetic
  | '-'
  | '*'
  | '%'
  | '/'
  | '+'

  // comparison
  | '!='
  | '<='
  | '=='
  | '>'
  | '<'
  | '>='

export type FormulaFunctionType =
  // logic
  | 'and'
  | 'empty'
  | 'equal'
  | 'if'
  | 'larger'
  | 'largerEq'
  | 'not'
  | 'or'
  | 'smaller'
  | 'smallerEq'
  | 'unequal'

  // numeric
  | 'abs'
  | 'add'
  | 'cbrt'
  | 'ceil'
  | 'divide'
  | 'exp'
  | 'floor'
  | 'ln'
  | 'log10'
  | 'log2'
  | 'max'
  | 'min'
  | 'mod'
  | 'multiply'
  | 'pow'
  | 'round'
  | 'sign'
  | 'sqrt'
  | 'subtract'
  | 'toNumber'
  | 'unaryMinus'
  | 'unaryPlus'

  // text
  | 'concat'
  | 'contains'
  | 'format'
  | 'join'
  | 'length'
  | 'replace'
  | 'replaceAll'
  | 'slice'
  | 'test'

  // date & time
  | 'date'
  | 'dateAdd'
  | 'dateBetween'
  | 'dateSubtract'
  | 'day'
  | 'end'
  | 'formatDate'
  | 'fromTimestamp'
  | 'hour'
  | 'minute'
  | 'month'
  | 'now'
  | 'start'
  | 'timestamp'
  | 'year'

export interface BaseFormula {
  type: FormulaType
  result_type: FormulaResultType
}

export interface ConstantFormula extends BaseFormula {
  type: 'constant'
  value: any // TODO
  value_type: FormulaValueType
}

export interface PropertyFormula extends BaseFormula {
  type: 'property'
  id: PropertyID
  name: string
}

export interface SymbolFormula extends BaseFormula {
  type: 'symbol'
  name: string
}

export interface FunctionFormula extends BaseFormula {
  type: 'function'
  name: FormulaFunctionType
  args: Array<Formula>
}

export interface OperatorFormula extends BaseFormula {
  type: 'operator'
  operator: FormulaOperatorType
  name: FormulaFunctionType
  args: Array<Formula>
}

export type Formula =
  | FunctionFormula
  | OperatorFormula
  | ConstantFormula
  | PropertyFormula
  | SymbolFormula
