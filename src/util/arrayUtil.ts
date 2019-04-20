import * as _ from 'lodash';

export function getDuplicates<T>(arr: T[]): T[] {
    return _.uniq(_.filter(arr, (val, i, iteratee) => _.includes(iteratee, val, i + 1)));
}

/**
 * Use as filter callback to get unique array
 */
export function distinct(value: any, index: number, self: any[]): boolean {
    return self.indexOf(value) === index;
}
