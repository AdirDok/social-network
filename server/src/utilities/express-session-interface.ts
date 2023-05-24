
import express from 'express';    /* למרות שאני לא צריך את השורה הזו פה אם אני מוריד אותה אני מקבל טעות בקובץ הראשי  למה ?  */
declare module 'express-session' {
    interface SessionData {
        superAdmin: boolean;
        email: string;
    }
}


// ===============זה עובד ===================
// import express from 'express';
// declare module 'express-session' {
//     interface SessionData {
//         superAdmin: boolean;
//         email: string;
//     }
// }

// ===============זה לא עובד ===================

// import express from 'express';

// interface SessionData {
//     email: string;
//     // add other properties you want to save in the session
// }

// declare global {
//     namespace Express {
//         interface Request {
//             session: SessionData;
//         }
//     }
// }


/* 
Both methods are used to add custom properties to the Express session object, but they differ in how they achieve this.

The first method extends the SessionData interface of the express-session module by declaring a module with the same name as the module to be extended. This approach is useful when you want to add or modify properties to an existing module's type definition. In this case, the user property of type string is added to the SessionData interface. This means that when you use the session object in your code, you will be able to access and set the user property on it.

The second method defines a new interface named SessionData and declares it globally inside the namespace Express.Request. This approach is useful when you want to create your own custom session object with your own set of properties. In this case, the SessionData interface has an email property of type string. The Request interface is then extended to include a session property that has the SessionData type. This means that when you use the session object in your code, you will be able to access and set the email property on it.

In summary, the first method extends an existing module's type definition, while the second method creates a new custom type definition and extends the Request interface to include it.
*/