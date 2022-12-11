import Document, {
    DocumentContext,
    Html,
    Head,
    Main,
    NextScript,
} from "next/document";

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);

        return initialProps;
    }

    render() {
        return (
            <Html className="dark" lang="en">
                <Head />
                <body className="bg-white dark:bg-bg">
                    <Main />
                    <NextScript />
                    <noscript
                        dangerouslySetInnerHTML={{
                        __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER}" height="0" width="0" style="display: none; visibility: hidden;" />`,
                        }}
                    />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
