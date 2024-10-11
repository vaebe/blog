import { Message } from '@prisma/client'

export interface MessageInfo extends Message {
  author: {
    name: string
    email: string
    image: string
  }
}
