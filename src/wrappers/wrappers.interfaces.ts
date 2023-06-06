export interface IRetryWrapperParam {
    task: () => any
    catchCase: (error) => any
    allowedTime: number
    returnsVoid?: boolean
    delay: number
    failureMessage: string
}

export interface IRetryVoidFuncWrapperParam {
    task: () => any
    catchCase: (error) => any
    allowedTime: number
    delay: number
    failureMessage: string
    voidPassed: boolean
    startTime: Date
}

export interface IRetryReturnsValueWrapperParam {
    task: () => any
    catchCase: (error) => any
    allowedTime: number
    delay: number
    failureMessage: string
    startTime: Date
}
