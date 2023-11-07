import {Iuser} from  '../../src/Models/User'

declare module 'express-serve-static-core'{
    interface Request{
        user : Iuser;
        token : string;
    }
    interface Application {
        close(callback?: () => void): void;
    }
}
declare module 'express' {

}