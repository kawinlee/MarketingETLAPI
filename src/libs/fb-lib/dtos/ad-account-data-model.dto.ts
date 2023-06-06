export class AdAccountDataDTO {
    adcreatives: AdCreativesDTO
    adsets: AdSetDTO
}

class AdCreativesDTO {
    data: AdCreativeDTO[]
}

class AdSetDTO {
    data : AdSetDataDTO[]
}

class AdSetDataDTO {
    id: string
    name: string
    insights: any
    ads: any
    adcreatives: AdCreativesDTO

}

class AdCreativeDTO {
    thumbnail_url: string
    id: string
}