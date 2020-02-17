import { Address } from 'vtex.checkout-graphql'
import { LineFragment } from '../typings/countryRulesTypes'

export interface CountryDescription {
  name: string
  summary: LineFragment[][]
}

export const countryDescriptions: CountryDescription[] = [
  {
    name: 'ARG',
    summary: [
      [{ name: 'street' }, { delimiter: ' ', name: 'number' }],
      [{ name: 'complement' }],
      [{ name: 'postalCode' }],
      [{ name: 'city' }, { delimiter: ', ', name: 'state' }],
    ],
  },
  {
    name: 'BRA',
    summary: [
      [
        { name: 'street' },
        { delimiter: ' ', name: 'number' },
        { delimiter: ', ', name: 'complement' },
      ],
      [
        { name: 'neighborhood', delimiterAfter: ' - ' },
        { name: 'city' },
        { delimiter: ' - ', name: 'state' },
      ],
      [{ name: 'postalCode' }],
    ],
  },
  {
    name: 'KOR',
    summary: [
      [{ name: 'street' }, { delimiter: ', ', name: 'complement' }],
      [
        { name: 'city' },
        { delimiter: ', ', name: 'state' },
        { delimiter: ' ', name: 'postalCode' },
      ],
    ],
  },
]

export const sampleAddress: Address = {
  street: 'Rua Afonso Camargo',
  number: '805',
  complement: '',
  postalCode: '85070-200',
  city: 'Guarapuava',
  state: 'PR',
  addressId: '',
  addressType: null,
  country: 'BRA',
  geoCoordinates: [],
  neighborhood: 'Santana',
  receiverName: null,
  reference: null,
}