import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return <div className='w-full h-screen flex justify-center items-center bg-gradient-to-br from-green-500/10 via-green-900/40 to-black'>
        <SignIn appearance={{
            elements: {

                card: 'backdrop-blur-2xl',
                header: "uppercase",
                socialButtonsBlockButton: "h-12",
            }
        }} />
    </div>
}