import { createHash } from 'crypto'
import type { Avocado, Attributes, PrismaClient, Prisma } from '@prisma/client'

type ResolverContext = {
  orm: PrismaClient
}

export const findAll = (
  parent: unknown,
  arg: { skip?: number; take?: number; where: Prisma.AvocadoWhereInput },
  context: ResolverContext
): Promise<Avocado[]> => {
  return context.orm.avocado.findMany({
    include: { attributes: true },
    where: arg.where,
    skip: arg.skip,
    take: arg.take,
  })
}

export const findOne = (
  parent: unknown,
  { id }: { id: string },
  context: ResolverContext
): Promise<Avocado | null> => {
  return context.orm.avocado.findUnique({
    where: { id: parseInt(id, 10) },
    include: { attributes: true },
  })
}

export const createAvocado = (
  parent: unknown,
  {
    data,
  }: { data: Pick<Avocado, 'name' | 'price' | 'image' | 'sku'> & Attributes },
  context: ResolverContext
): Promise<Avocado> => {
  const { name, price, image, sku, ...attributes } = data

  return context.orm.avocado.create({
    data: {
      name,
      price,
      image,
      sku: new Date().getTime().toString(),
      attributes: {
        create: {
          ...attributes,
        },
      },
    },
  })
}

export const resolver: Record<
  keyof (Avocado & { attributes: Attributes }),
  (parent: Avocado & { attributes: Attributes }) => unknown
> = {
  id: (parent) => parent.id,
  createdAt: (parent) => parent.createdAt,
  updatedAt: (parent) => parent.updatedAt,
  deletedAt: (parent) => parent.deletedAt,
  sku: (parent) => parent.sku,
  name: (parent) => parent.name,
  price: (parent) => parent.price,
  image: (parent) => parent.image,
  attributes: (parent) => ({
    description: parent.attributes.description,
    shape: parent.attributes.shape,
    hardiness: parent.attributes.hardiness,
    taste: parent.attributes.taste,
  }),
}
