import * as avo from './avocado.resolver'
import * as scalars from './scalars'

export default {
  ...scalars,
  Query: {
    listAvocados: avo.findAll,
    getAvocado: avo.findOne,
  },
  Mutation: {
    createAvocado: avo.createAvocado,
  },
  Avocado: avo.resolver,
}
