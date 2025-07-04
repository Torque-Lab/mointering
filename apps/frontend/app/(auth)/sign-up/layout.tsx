import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up-SiteWatch",
    description: "Sign up to your account.",
};
export default function SignUpLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
