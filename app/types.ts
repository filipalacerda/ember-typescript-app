export type Product = {
  id: number;
  property_values: {
    property_id: number;
    value: string | number;
  }[];
};

export type Operator = {
  text: string;
  id: string;
};

export type Products = Product[];

export type PropertyType = 'string' | 'number' | 'enumerated' | undefined;

export type Property = {
  id: number;
  name: string;
  type: PropertyType;
  values?: string[];
};

export type Filters = {
  operator?: Operator;
  property?: Property;
  value?: string;
};
