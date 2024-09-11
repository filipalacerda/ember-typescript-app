import type { Filters, Product, Products } from './types';

/**
 * The value the user inputs could be all in uppercase.
 * Also, one of the products properties is capitalized
 * we want to make sure we are comparing the same string.
 *
 * We also need to trim the whitespaces that the user
 * may enter on the search field
 * @param value
 * @returns
 */
const normalizeValueToString = (value: string | number) => {
  if (typeof value === 'string') {
    return value.toLowerCase().trim();
  } else if (typeof value === 'number') {
    return value.toString().trim();
  }
  return value;
};

/**
 * For the greater_than and the less_than filters
 * we need to parse the provided value to be a number
 * @param value
 * @returns
 */
const normalizeValueToNumber = (value?: string | number) => {
  if (typeof value === 'string') {
    return parseInt(value);
  }

  return value;
};

/**
 * Performs the equal search.
 *
 * Since the value can be capitalized or a number,
 * we normalize both the values for each case.
 *
 * @param products
 * @param filters
 * @returns array
 */
const equalFilter = (products: Products, filters: Filters) => {
  const propertyId = filters.property?.id;
  const propertyType = filters.property?.type;
  const filterValue = filters.value as string;
  // Only filters after the user types in a value
  if (!filterValue) {
    return products;
  } else {
    return products.reduce((acc, product) => {
      product.property_values.forEach((value) => {
        if (value.property_id === propertyId) {
          if (propertyType === 'string' || propertyType === 'enumerated') {
            if (
              normalizeValueToString(value.value) ===
              normalizeValueToString(filterValue)
            ) {
              acc.push(product);
            }
          } else if (propertyType === 'number') {
            if (
              normalizeValueToNumber(value.value) ===
              normalizeValueToNumber(filterValue)
            ) {
              acc.push(product);
            }
          }
        }
      });
      return acc;
    }, [] as Products);
  }
};

/**
 * greater_than operator is only used for number properties.
 *
 * We need to normalize the value input by the user
 * and compare with the property_id value
 *
 * @param products
 * @param filters
 * @returns array
 */
const greaterThanFilter = (products: Products, filters: Filters) => {
  const propertyId = filters.property?.id;
  const filterValue = normalizeValueToNumber(filters.value);
  // Only filters after the user types in a value
  if (!filterValue) {
    return products;
  } else {
    return products.reduce((acc: Products[], product: Product) => {
      product.property_values.forEach((value) => {
        const valueProperty = value.value as number;
        if (value.property_id === propertyId) {
          if (valueProperty > filterValue) {
            acc.push(product);
          }
        }
      });
      return acc;
    }, [] as Products);
  }
};

/**
 * less_than operator is only used for number properties.
 *
 * We need to normalize the value input by the user
 * and compare with the property_id value
 *
 * @param products
 * @param filters
 * @returns array
 */
const lessThanFilter = (products: Products, filters: Filters) => {
  const propertyId = filters.property?.id;
  const filterValue = normalizeValueToNumber(filters.value);
  // Only filters after the user types in a value
  if (!filterValue) {
    return products;
  } else {
    return products.reduce((acc, product) => {
      product.property_values.forEach((value) => {
        const valueProperty = value.value as number;
        if (value.property_id === propertyId) {
          if (valueProperty < filterValue) {
            acc.push(product);
          }
        }
      });
      return acc;
    }, [] as Products);
  }
};

/**
 * If any filter is applied, returns all the products
 * where the property selected has a value
 *
 * @param products
 * @param filters
 * @returns
 */
const anyFilter = (products: Products, filters: Filters) => {
  const propertyId = filters.property?.id;

  return products.reduce((acc, product) => {
    product.property_values.forEach((value) => {
      if (
        value.property_id === propertyId &&
        (value.value || value.value !== null)
      ) {
        acc.push(product);
      }
    });
    return acc;
  }, [] as Products);
};

/**
 * For the none filter, we want to return the products that don't have an object on the property_values array
 * In this case, i'm assuming the property_id needs to be taken in consideration
 * and that the order of the property_values array matches the index of the selected property
 *
 * @param products
 * @param filters
 * @returns
 */
const noneFilter = (products: Products, filters: Filters) => {
  const propertyId = filters.property?.id as number;

  return products.reduce((acc, product) => {
    // if the value is not defined, the `property_values` object does not exist
    if (product.property_values[propertyId] === undefined) {
      acc.push(product);
    }
    return acc;
  }, [] as Products);
};

/**
 * In the in filter, the value could have more than one world typed in.
 * According to the specs, the values will be separated by a comma.
 *
 * This function also assumes that a number can be typed in
 * although the input type is a number and won't allow for more than one number to be typed
 *
 * @param products
 * @param filters
 */
const inFilter = (products: Products, filters: Filters) => {
  const propertyId = filters.property?.id;
  const propertyType = filters.property?.type;
  const filterValues = filters.value ? filters.value?.split(',') : [];

  let i: number;

  // If the input has no value, returns the products
  if (!filterValues.length) {
    return products;
  }

  return products.reduce((acc, product) => {
    product.property_values.forEach((value) => {
      if (value.property_id === propertyId) {
        for (i = 0; i <= filterValues?.length; i++) {
          const filterValue = filterValues[i];

          if (propertyType === 'string' || propertyType === 'enumerated') {
            if (
              normalizeValueToString(value.value) ===
              normalizeValueToString(filterValue)
            ) {
              if (!acc.some((e) => e.id === product.id)) {
                acc.push(product);
              }
            }
          } else if (propertyType === 'number') {
            if (
              normalizeValueToNumber(value.value) ===
              normalizeValueToNumber(filterValue)
            ) {
              if (!acc.some((e) => e.id === product.id)) {
                acc.push(product);
              }
            }
          }
        }
      }
    });
    return acc;
  }, [] as Products);
};

/**
 * The contains filter checks if the product has the value typed in
 * @param products
 * @param filters
 */
const containsFilter = (products: Products, filters: Filters) => {
  const propertyId = filters.property?.id;
  const filterValue = filters.value as string;
  // Only filters after the user types in a value
  if (!filterValue) {
    return products;
  } else {
    return products.reduce((acc, product) => {
      product.property_values.forEach((value) => {
        if (value.property_id === propertyId) {
          if (
            normalizeValueToString(value.value).includes(
              normalizeValueToString(filterValue),
            )
          ) {
            acc.push(product);
          }
        }
      });
      return acc;
    }, [] as Products);
  }
};

export {
  normalizeValueToString,
  normalizeValueToNumber,
  equalFilter,
  greaterThanFilter,
  lessThanFilter,
  anyFilter,
  noneFilter,
  inFilter,
  containsFilter,
};
