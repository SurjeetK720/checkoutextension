import {
    reactExtension,
    Text,
    Link,
    View,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
    'purchase.checkout.contact.render-after',
    () => <Extension />,
);
function Extension() {
    return (
        <View>
            <Text>
                 The trusted <Link to='https://www.hul.co.in/brands/'>  Unilever Brands </Link> via Email and SMS, Whatsapp and online advertising tailored to my interests and preferences* . Please read our <Link to="https://www.unilevernotices.com/privacy-notices/india-english.html">Privacy </Link>  and <Link to="https://www.unilevernotices.com/cookie-notices/india-english.html">Cookie Notice</Link> to understand how we use your Personal Data. I confirm I am over 18 years old.
            </Text>
        </View>
    )
}