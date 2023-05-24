export default async function sanitizingUserInput(...data: string[]): Promise<boolean> {
    /*  note that this function does not check the type of values ​​it receives, it expects to receive strings */
    const forbiddenInputs: RegExp = /^<([a-z]+)([^>]+)*(?:>(.*)<\/\1>|\s+\/>)$/;
    let isUserInputOk: boolean = true;

    try {

        for (const i of data) {
            if (forbiddenInputs.test(i)){
                isUserInputOk = false;
                break;
            }  
        }
        return isUserInputOk

    } catch (error) {
        console.log('this is from sanitizingUserInput : '.bgRed, error)
        isUserInputOk = true
        return isUserInputOk
    }

}