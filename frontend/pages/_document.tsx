import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    // Get the locale from Next.js data
    const locale = this.props.__NEXT_DATA__.locale || 'ar';
    
    // Define RTL languages
    const rtlLanguages = ['ar', 'he', 'fa', 'ur']; // Arabic, Hebrew, Persian, Urdu
    const isRTL = rtlLanguages.includes(locale);
    
    return (
      <Html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
        <Head>
          {/* External CSS links */}
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
          
          {/* CSS variables for direction-aware styling */}
          <style dangerouslySetInnerHTML={{
            __html: `
              :root {
                --text-align-start: ${isRTL ? 'right' : 'left'};
                --text-align-end: ${isRTL ? 'left' : 'right'};
                --margin-start: ${isRTL ? 'margin-right' : 'margin-left'};
                --margin-end: ${isRTL ? 'margin-left' : 'margin-right'};
                --padding-start: ${isRTL ? 'padding-right' : 'padding-left'};
                --padding-end: ${isRTL ? 'padding-left' : 'padding-right'};
                --border-start: ${isRTL ? 'border-right' : 'border-left'};
                --border-end: ${isRTL ? 'border-left' : 'border-right'};
              }
            `
          }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;