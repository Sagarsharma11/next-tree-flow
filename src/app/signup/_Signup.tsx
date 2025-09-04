import React from 'react'
import SignUp from './SignUp'

type Props = {}

const page = (props: Props) => {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <SignUp />
            </div>
        </div>
    )
}

export default page