import { Helpers } from "src/helpers/helpers"
import { IRetryReturnsValueWrapperParam, IRetryVoidFuncWrapperParam, IRetryWrapperParam } from "./wrappers.interfaces"

export class Wrappers {

    // The functions will return undefined if and only if there are issues with pulling the data 
    static async retryWrapper(params: IRetryWrapperParam) {
        let { task, catchCase, allowedTime, returnsVoid, failureMessage, delay } = params
        const startTime = new Date()
        let voidPassed = false
        if (!returnsVoid) returnsVoid = false
        if (returnsVoid) {
            return await Wrappers._retryVoidFuncWrapper({ task, catchCase, allowedTime, delay, failureMessage, voidPassed, startTime })
        } else { // When we expect a return
            return await Wrappers._retryReturnsValueWrapper({ task, catchCase, allowedTime, delay, failureMessage, startTime })
        }
    }

    private static async _retryReturnsValueWrapper(params: IRetryReturnsValueWrapperParam) {
        let { task, catchCase, allowedTime, delay, startTime } = params
        let result: any
        while (!result) { 
            const timeElapsed = (new Date().getTime() - startTime.getTime()) / 1000
            try {
                result = await task()
            } catch (foundError) {
                catchCase(foundError)
                await Helpers.delay(delay)
                console.log("in catch");     
                if (timeElapsed > allowedTime) break // throw error and catch outisde 
                throw new Error('mock')  
            }
        }
        return result
    }

    private static async _retryVoidFuncWrapper(params: IRetryVoidFuncWrapperParam) {
        let { task, catchCase, allowedTime, delay, voidPassed, startTime } = params
        while (!voidPassed) {
            const timeElapsed = (new Date().getTime() - startTime.getTime()) / 1000
            try {
                await task()
                voidPassed = true
            } catch (foundError) {
                catchCase(foundError)
                await Helpers.delay(delay)
                if (timeElapsed > allowedTime && !voidPassed) break
            }
        }
        if (voidPassed) return "Task ran successfully"
    }
}