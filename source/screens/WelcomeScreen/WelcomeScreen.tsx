import React, {useCallback, useState} from 'react';
import Realm, { BSON } from 'realm';
import {useApp} from '@realm/react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet, Text, View, Alert, TouchableOpacity, Dimensions, ScrollView, Linking} from 'react-native';
import {Input, Button} from '@rneui/base';
import {colors} from '../../sharedStyling/Colors';
import styles from './WelcomeScreen.style';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { shadow } from '../../sharedStyling/Shadow';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export function WelcomeScreen(): React.ReactElement {

  
  const goToLink = (url:string) => {
    Linking.openURL(url).catch((err) => Alert.alert("Link Broken..."))
}

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');


  // state values for toggable visibility of features in the UI
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [isInSignUpMode, setIsInSignUpMode] = useState(true);

  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsAndConditions, setShowTermsAndConditions] = useState(false);

  const app = useApp();
  //const user = useUser();

  // signIn() uses the emailPassword authentication provider to log in
  const signIn = useCallback(async () => {
    const creds = Realm.Credentials.emailPassword(email, password);
    await app.logIn(creds)
  }, [app, email, password]);

  // onPressSignIn() uses the emailPassword authentication provider to log in
  const onPressSignIn = useCallback(async () => {
    try {
      await signIn();
    } catch (error: any) {
      Alert.alert(`Failed to sign in: ${error?.message}`);
    }
  }, [signIn]);

  // onPressSignUp() registers the user and then calls signIn to log the user in
  const onPressSignUp = useCallback(async () => {
    try {
      await app.emailPasswordAuth.registerUser({email, password});
      await signIn();
      await updateUserData(app.currentUser);
    } catch (error: any) {
      Alert.alert(`Failed to sign up: ${error?.message}`);
      console.log("Failed to sign up: " + error?.message)
    }
  }, [signIn, app, email, password]);


  const updateUserData = async (user:any) => {
    try {
      const result = await user.functions.updateUserInformation(firstName, surname, username)
      const userStatisticsResult = await user.functions.addUserStatistics(new BSON.ObjectID(), user.id)
      //console.log("Result", result)
      //console.log("User Stats", userStatisticsResult)
    }

    catch (e) {
      console.log(e)
    }
  } 

  const PrivacyPolicy = () => {

    return (
      <View style={{width: screenWidth - 50, }}>
      <View style={{width: '100%', height: 60, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',}}>
          <View style={styles.headerTitle}>
              <TouchableOpacity onPress={() => setShowPrivacyPolicy(false)} style={styles.closeButton}>
                  <MaterialCommunityIcons name="arrow-left" size={40}/>
              </TouchableOpacity> 
              <Text style={{fontSize: 20, fontWeight: '800', marginLeft: 20,}}>Privacy Policy</Text>
          </View>
      </View>
      <View>
          <Text style={styles.h3}>
          Last updated: July 02, 2024
          {"\n"}
          </Text>
          <Text style={styles.h4}>
          This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.

          We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy. This Privacy Policy has been created with the help of the Privacy Policy Generator.
          {"\n"}
          </Text>
          <Text style={styles.h1}>
              Interpretation and Definitions
          </Text>
          <View style={styles.border}></View>
          <Text style={styles.h2}>
              Interpretation
          </Text>
          <Text style={styles.h4}>
          The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
          </Text>
          <Text style={styles.h2}>
          Definitions
          </Text>
          <Text style={styles.h3}>
          For the purposes of this Privacy Policy:
          </Text>
          <Text style={styles.h4}>
         Account means a unique account created for You to access our Service or parts of our Service.{"\n"}{"\n"}Affiliate means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.{"\n"}{"\n"}Application refers to UltiTracker, the software program provided by the Company.{"\n"}{"\n"}Company (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to UltiTracker.{"\n"}{"\n"}Country refers to: Ireland{"\n"}{"\n"}Device means any device that can access the Service such as a computer, a cellphone or a digital tablet.{"\n"}{"\n"}Personal Data is any information that relates to an identified or identifiable individual.{"\n"}{"\n"}Service refers to the Application.{"\n"}{"\n"}Service Provider means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used.{"\n"}{"\n"}Usage Data refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).{"\n"}{"\n"}You means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.{"\n"}
          </Text>
          <Text style={styles.h1}>
          Collecting and Using Your Personal Data
          </Text>
          <View style={styles.border}></View>
          <Text style={styles.h2}>
          Types of Data Collected
          </Text>
          <Text style={styles.h3}>
          Personal Data
          </Text>
          <Text style={styles.h4}>
          While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:{"\n"}{"\n"}

Email address{"\n"}{"\n"}

First name and last name{"\n"}{"\n"}

Usage Data{"\n"}
          </Text>
          <Text  style={styles.h3}>
          Usage Data
          </Text>
          <Text style={styles.h4}>
          Usage Data is collected automatically when using the Service.{"\n"}{"\n"}

Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.{"\n"}{"\n"}

When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data.{"\n"}{"\n"}

We may also collect information that Your browser sends whenever You visit our Service or when You access the Service by or through a mobile device.{"\n"}{"\n"}
          </Text>
          <Text  style={styles.h3}>
          Information Collected while Using the Application
          </Text>
          <Text>
          While using Our Application, in order to provide features of Our Application, We may collect, with Your prior permission:{"\n"}{"\n"}

Pictures and other information from your Device's camera and photo library{"\n"}{"\n"}
We use this information to provide features of Our Service, to improve and customize Our Service. The information may be uploaded to the Company's servers and/or a Service Provider's server or it may be simply stored on Your device.{"\n"}{"\n"}

You can enable or disable access to this information at any time, through Your Device settings.{"\n"}{"\n"}
          </Text>
          <Text  style={styles.h3}>
          Use of Your Personal Data
          </Text>
          <Text style={styles.h4}>
          The Company may use Personal Data for the following purposes:{"\n"}{"\n"}

To provide and maintain our Service, including to monitor the usage of our Service.{"\n"}{"\n"}

To manage Your Account: to manage Your registration as a user of the Service. The Personal Data You provide can give You access to different functionalities of the Service that are available to You as a registered user.{"\n"}{"\n"}

For the performance of a contract: the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.{"\n"}{"\n"}

To contact You: To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a mobile application's push notifications regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation.{"\n"}{"\n"}

To provide You with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless You have opted not to receive such information.{"\n"}{"\n"}

To manage Your requests: To attend and manage Your requests to Us.{"\n"}{"\n"}

For business transfers: We may use Your information to evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Our assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which Personal Data held by Us about our Service users is among the assets transferred.{"\n"}{"\n"}

For other purposes: We may use Your information for other purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Service, products, services, marketing and your experience.{"\n"}{"\n"}

We may share Your personal information in the following situations:{"\n"}
          </Text>
          <Text style={styles.h4}>
          With Service Providers: We may share Your personal information with Service Providers to monitor and analyze the use of our Service, to contact You.{"\n"}{"\n"}
For business transfers: We may share or transfer Your personal information in connection with, or during negotiations of, any merger, sale of Company assets, financing, or acquisition of all or a portion of Our business to another company.{"\n"}{"\n"}
With Affiliates: We may share Your information with Our affiliates, in which case we will require those affiliates to honor this Privacy Policy. Affiliates include Our parent company and any other subsidiaries, joint venture partners or other companies that We control or that are under common control with Us.{"\n"}{"\n"}
With business partners: We may share Your information with Our business partners to offer You certain products, services or promotions.{"\n"}{"\n"}
With other users: when You share personal information or otherwise interact in the public areas with other users, such information may be viewed by all users and may be publicly distributed outside.{"\n"}{"\n"}
With Your consent: We may disclose Your personal information for any other purpose with Your consent.{"\n"}{"\n"}
          </Text>
          <Text  style={styles.h3}>
          Retention of Your Personal Data
          </Text>
          <Text style={styles.h4}>
          The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.{"\n"}{"\n"}

The Company will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of Our Service, or We are legally obligated to retain this data for longer time periods.{"\n"}{"\n"}
          </Text>
          <Text  style={styles.h3}>
          Transfer of Your Personal Data
          </Text>
          <Text style={styles.h4}>
          Your information, including Personal Data, is processed at the Company's operating offices and in any other places where the parties involved in the processing are located. It means that this information may be transferred to — and maintained on — computers located outside of Your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from Your jurisdiction.{"\n"}{"\n"}

Your consent to this Privacy Policy followed by Your submission of such information represents Your agreement to that transfer.{"\n"}{"\n"}

The Company will take all steps reasonably necessary to ensure that Your data is treated securely and in accordance with this Privacy Policy and no transfer of Your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of Your data and other personal information.{"\n"}{"\n"}
          </Text>
          <Text  style={styles.h3}>
          Delete Your Personal Data
          </Text>
          <Text style={styles.h4}>
          You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You.{"\n"}{"\n"}

Our Service may give You the ability to delete certain information about You from within the Service.{"\n"}{"\n"}

You may update, amend, or delete Your information at any time by signing in to Your Account, if you have one, and visiting the account settings section that allows you to manage Your personal information. You may also contact Us to request access to, correct, or delete any personal information that You have provided to Us.{"\n"}{"\n"}

Please note, however, that We may need to retain certain information when we have a legal obligation or lawful basis to do so.{"\n"}{"\n"}
          </Text>
          <Text style={styles.h3}>
          Disclosure of Your Personal Data
          </Text>
          <Text  style={styles.bold}>
          Business Transactions
          </Text>
          <Text style={styles.h4}>
          If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred. We will provide notice before Your Personal Data is transferred and becomes subject to a different Privacy Policy.{"\n"}
          </Text>
          <Text  style={styles.bold}>
          Law enforcement
          </Text>
          <Text style={styles.h4}>
          Under certain circumstances, the Company may be required to disclose Your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency).{"\n"}
          </Text>
          <Text  style={styles.bold}>
          Other legal requirements
          </Text>
          <Text style={styles.h4}>
          The Company may disclose Your Personal Data in the good faith belief that such action is necessary to:{"\n"}{"\n"}

Comply with a legal obligation{"\n"}{"\n"}
Protect and defend the rights or property of the Company{"\n"}{"\n"}
Prevent or investigate possible wrongdoing in connection with the Service{"\n"}{"\n"}
Protect the personal safety of Users of the Service or the public{"\n"}{"\n"}
Protect against legal liability{"\n"}{"\n"}
          </Text>
          <Text style={styles.h3}>
          Security of Your Personal Data
          </Text>
          <Text style={styles.h4}>
          The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.{"\n"}{"\n"}
          </Text>
          <Text style={styles.h1}>
          Children's Privacy
          </Text>
          <View style={styles.border}></View>
          <Text>
          Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us. If We become aware that We have collected Personal Data from anyone under the age of 13 without verification of parental consent, We take steps to remove that information from Our servers.{"\n"}{"\n"}

If We need to rely on consent as a legal basis for processing Your information and Your country requires consent from a parent, We may require Your parent's consent before We collect and use that information.{"\n"}{"\n"}
          </Text>
          <Text style={styles.h1}>
          Links to Other Websites
          </Text>
          <View style={styles.border}></View>
          <Text>
          Our Service may contain links to other websites that are not operated by Us. If You click on a third party link, You will be directed to that third party's site. We strongly advise You to review the Privacy Policy of every site You visit.{"\n"}{"\n"}

We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.{"\n"}{"\n"}
          </Text>

          <Text style={styles.h1}>
          Changes to this Privacy Policy
          </Text>
          <View style={styles.border}></View>
          <Text>
          We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.{"\n"}{"\n"}

We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the "Last updated" date at the top of this Privacy Policy.{"\n"}{"\n"}

You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.{"\n"}{"\n"}
          </Text>
          <Text style={styles.h1}>
          Contact Us
          </Text>
          <View style={styles.border}></View>
          <Text>
          If you have any questions about this Privacy Policy, You can contact us:{"\n"}
          </Text>
          <TouchableOpacity onPress={() => goToLink('mailto:contact@ultitracker.pro')}>
              <Text style={{color: colors.blue, fontWeight: '900'}}>
                  By email: ultitrackerltd@gmail.com
              </Text>
          </TouchableOpacity>
          
      </View>
      </View>
  )
  }

  const TermsOfService = () => {

    return (
      <View style={{width: screenWidth - 50, }}>
      <View style={{width: '100%', height: 60, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',}}>
          <View style={styles.headerTitle}>
              <TouchableOpacity onPress={() => setShowTermsAndConditions(false)} style={styles.closeButton}>
                  <MaterialCommunityIcons name="arrow-left" size={40}/>
              </TouchableOpacity> 
              <Text style={{fontSize: 20, fontWeight: '800', marginLeft: 20,}}>Terms & Conditions</Text>
      </View>
      </View>

  <View>
    <Text style={styles.h3}>Updated at July 3rd, 2024{"\n"}</Text>

    
      <Text style={styles.h1}>
      General Terms 
      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
        By accessing and placing an order with UltiTracker, you confirm that you are in agreement with and bound
        by the terms of service contained in the Terms & Conditions outlined below. These terms apply to the entire
        website and any email or other type of communication between you and UltiTracker.{"\n"}
      </Text>
      <Text style={styles.h4}>
        Under no circumstances shall UltiTracker team be liable for any direct, indirect, special, incidental or
        consequential damages, including, but not limited to, loss of data or profit, arising out of the use, or the
        inability to use, the materials on this site, even if UltiTracker team or an authorized representative has been
        advised of the possibility of such damages. If your use of materials from this site results in the need for
        servicing, repair or correction of equipment or data, you assume any costs thereof.{"\n"}
      </Text>
      <Text style={styles.h4}>
        UltiTracker will not be responsible for any outcome that may occur during the course of usage of our
        resources. We reserve the rights to change prices and revise the resources usage policy in any moment.{"\n"}
      </Text>
    

    <View>
      <Text style={styles.h1}>
      License
      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
        UltiTracker grants you a revocable, non-exclusive, non-transferable, limited license to download, install and
        use the app strictly in accordance with the terms of this Agreement.{"\n"}
      </Text>
      <Text style={styles.h4}>
        These Terms & Conditions are a contract between you and UltiTracker (referred to in these Terms &
        Conditions as "UltiTracker", "us", "we" or "our"), the provider of the UltiTracker website and the services
        accessible from the UltiTracker website (which are collectively referred to in these Terms & Conditions as the
        "UltiTracker Service").{"\n"}
      </Text>
      <Text style={styles.h4}>
        You are agreeing to be bound by these Terms & Conditions. If you do not agree to these Terms &
        Conditions, please do not use the UltiTracker Service. In these Terms & Conditions, "you" refers both to you
        as an individual and to the entity you represent. If you violate any of these Terms & Conditions, we reserve
        the right to cancel your account or block access to your account without notice.{"\n"}
      </Text>
    </View>

    <View>
      <Text style={styles.h1}>
      Definitions and key terms
      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
      Cookie:
        small amount of data generated by a website and saved by your web browser. It is used to
        identify your browser, provide analytics, remember information about you such as your language
        preference or login information.{"\n"}
      </Text>
      <Text style={styles.h4}>
      Company:
        when this terms mention “Company,” “we,” “us,” or “our,” it refers to UltiTracker, that is
        responsible for your information under this Terms & Conditions.{"\n"}
      </Text>
      <Text style={styles.h4}>
      Country:
        where UltiTracker or the owners/founders of UltiTracker are based, in this case is Ireland.{"\n"}
      </Text>
      <Text style={styles.h4}>
      Device:
        any internet connected device such as a phone, tablet, computer or any other device that can
        be used to visit UltiTracker and use the services.{"\n"}
      </Text>
      <Text style={styles.h4}>
      Service:
        refers to the service provided by UltiTracker as described in the relative terms (if available) and
        on this platform.{"\n"}
      </Text>
      <Text style={styles.h4}>
      Third-party service:
        refers to advertisers, contest sponsors, promotional and marketing partners, and
        others who provide our content or whose products or services we think may interest you.{"\n"}
      </Text>
      <Text style={styles.h4}>
      App/Application:
        UltiTracker app, refers to the SOFTWARE PRODUCT identified above.{"\n"}
      </Text>
      <Text style={styles.h4}>
      You
        a person or entity that is registered with UltiTracker to use the Services.{"\n"}{"\n"}
      </Text>
      <View style={styles.border}></View>
    </View>
    <Text style={styles.h4}>
      This Terms & Conditions were created with Termify.
    </Text>
    <View style={styles.border}></View>
          <Text>
          {"\n"}
          </Text>
    <View >
      <Text style={styles.h1}>
      Restrictions
      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
      You agree not to, and you will not permit others to:{"\n"}
      </Text>
      <Text style={styles.h4}>
        License, sell, rent, lease, assign, distribute, transmit, host, outsource, disclose or otherwise
        commercially exploit the app or make the platform available to any third party.{"\n"}
      </Text>
      <Text style={styles.h4}>
        Modify, make derivative works of, disassemble, decrypt, reverse compile or reverse engineer any part
        of the app.{"\n"}
      </Text>
      <Text style={styles.h4}>
        Remove, alter or obscure any proprietary notice (including any notice of copyright or trademark) of
        UltiTracker or its affiliates, partners, suppliers or the licensors of the app.{"\n"}
      </Text>
    </View>

    <View>
      <Text style={styles.h1}>
      Return and Refund Policy
      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
      
        Thanks for shopping at UltiTracker. We appreciate the fact that you like to buy the stuff we build. We also
        want to make sure you have a rewarding experience while you're exploring, evaluating, and purchasing our
        products.{"\n"}
      </Text>
      <Text style={styles.h4}>
        As with any shopping experience, there are terms and conditions that apply to transactions at UltiTracker.
        We'll be as brief as our attorneys will allow. The main thing to remember is that by placing an order or
        making a purchase at UltiTracker, you agree to the terms along with UltiTracker's Privacy Policy.{"\n"}
      </Text>
      <Text style={styles.h4}>
        If, for any reason, You are not completely satisfied with any good or service that we provide, don't hesitate to
        contact us and we will discuss any of the issues you are going through with our product.{"\n"}
      </Text>
    </View>

    <View>
      <Text style={styles.h1}>
      Your Suggestions
      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
      
        Any feedback, comments, ideas, improvements or suggestions (collectively, "Suggestions") provided by you
        to UltiTracker with respect to the app shall remain the sole and exclusive property of UltiTracker.{"\n"}
      </Text>
      <Text style={styles.h4}>
        UltiTracker shall be free to use, copy, modify, publish, or redistribute the Suggestions for any purpose and in
        any way without any credit or any compensation to you.{"\n"}
      </Text>
    </View>

    <View>
    <Text style={styles.h1}>
      Your Consent
      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
      
        We've updated our Terms & Conditions to provide you with complete transparency into what is being set
        when you visit our site and how it's being used. By using our app, registering an account, or making a
        purchase, you hereby consent to our Terms & Conditions.{"\n"}
      </Text>
    </View>

    <View >
    <Text style={styles.h1}>
      Links to Other Websites
      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
        This Terms & Conditions applies only to the Services. The Services may contain links to other websites not
        operated or controlled by UltiTracker. We are not responsible for the content, accuracy or opinions
        expressed in such websites, and such websites are not investigated, monitored or checked for accuracy or
        completeness by us. Please remember that when you use a link to go from the Services to another website,
        our Terms & Conditions are no longer in effect. Your browsing and interaction on any other website,
        including those that have a link on our platform, is subject to that website's own rules and policies. Such third
        parties may use their own cookies or other methods to collect information about you.{"\n"}
      </Text>
    </View>

    <View >
    <Text style={styles.h1}>
      Cookies
      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
        UltiTracker uses "Cookies" to identify the areas of our app that you have visited. A Cookie is a small piece of
        data stored on your computer or mobile device by your web browser. We use Cookies to enhance the
        performance and functionality of our app but are non-essential to their use. However, without these cookies,
        certain functionality like videos may become unavailable or you would be required to enter your login details
        every time you visit the app as we would not be able to remember that you had logged in previously. Most
        web browsers can be set to disable the use of Cookies. However, if you disable Cookies, you may not be
        able to access functionality on our app correctly or at all. We never place Personally Identifiable Information
        in Cookies.{"\n"}
      </Text>
    </View>

    <View >
    <Text style={styles.h1}>
      Changes To Our Terms & Conditions
      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
      Changes To Our Terms & Conditions
        You acknowledge and agree that UltiTracker may stop (permanently or temporarily) providing the Service (or
        any features within the Service) to you or to users generally at UltiTracker's sole discretion, without prior
        notice to you. You may stop using the Service at any time. You do not need to specifically inform UltiTracker
        when you stop using the Service. You acknowledge and agree that if UltiTracker disables access to your
        account, you may be prevented from accessing the Service, your account details or any files or other
        materials which is contained in your account.{"\n"}
      </Text>
      <Text style={styles.h4}>
        If we decide to change our Terms & Conditions, we will post those changes on this page, and/or update the
        Terms & Conditions modification date below.{"\n"}
      </Text>
    </View>

    <View>
    <Text style={styles.h1}>
      Modification to Our App
      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
        UltiTracker reserves the right to modify, suspend or discontinue, temporarily or permanently, the app or any
        service to which it connects, with or without notice and without liability to you.{"\n"}
      </Text>
    </View>

    <View>
    <Text style={styles.h1}>
      Updates to Our App
      </Text>
      <View style={styles.border}></View>

      <Text style={styles.h4}>
        UltiTracker may from time to time provide enhancements or improvements to the features/functionality of the
        app, which may include patches, bug fixes, updates, upgrades and other modifications ("Updates").{"\n"}
      </Text>
      <Text style={styles.h4}>
        Updates may modify or delete certain features and/or functionalities of the app. You agree that UltiTracker
        has no obligation to (i) provide any Updates, or (ii) continue to provide or enable any particular features
        and/or functionalities of the app to you.{"\n"}
      </Text>
      <Text style={styles.h4}>
        You further agree that all Updates will be (i) deemed to constitute an integral part of the app, and (ii) subject
        to the terms and conditions of this Agreement.{"\n"}
      </Text>
    </View>

    <View>
    <Text style={styles.h1}>
      Third-Party Services
      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
        We may display, include or make available third-party content (including data, information, applications and
        other products services) or provide links to third-party websites or services ("Third- Party Services").{"\n"}
      </Text>
      <Text style={styles.h4}>
        You acknowledge and agree that UltiTracker shall not be responsible for any Third-Party Services, including
        their accuracy, completeness, timeliness, validity, copyright compliance, legality, decency, quality or any
        other aspect thereof. UltiTracker does not assume and shall not have any liability or responsibility to you or
        any other person or entity for any Third-Party Services.{"\n"}
      </Text>
      <Text style={styles.h4}>
        Third-Party Services and links thereto are provided solely as a convenience to you and you access and use
        them entirely at your own risk and subject to such third parties' terms and conditions.{"\n"}
      </Text>
    </View>

    <View >
    <Text style={styles.h1}>
      Term and Termination
      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
        This Agreement shall remain in effect until terminated by you or UltiTracker.{"\n"}
      </Text>
      <Text style={styles.h4}>
        UltiTracker may, in its sole discretion, at any time and for any or no reason, suspend or terminate this
        Agreement with or without prior notice.{"\n"}
      </Text>
      <Text style={styles.h4}>
        This Agreement will terminate immediately, without prior notice from UltiTracker, in the event that you fail to
        comply with any provision of this Agreement. You may also terminate this Agreement by deleting the app
        and all copies thereof from your computer.{"\n"}
      </Text>
      <Text style={styles.h4}>
        Upon termination of this Agreement, you shall cease all use of the app and delete all copies of the app from
        your computer.{"\n"}
      </Text>
      <Text style={styles.h4}>
        Termination of this Agreement will not limit any of UltiTracker's rights or remedies at law or in equity in case
        of breach by you (during the term of this Agreement) of any of your obligations under the present Agreement.{"\n"}
      </Text>
    </View>

    <View>
    <Text style={styles.h1}>
      Copyright Infringement Notice
      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
        If you are a copyright owner or such owner's agent and believe any material on our app constitutes an
        infringement on your copyright, please contact us setting forth the following information: (a) a physical or
        electronic signature of the copyright owner or a person authorized to act on behalf of the owner; (b)
        identification of the material that is claimed to be infringing; (c) your contact information, including your
        address, telephone number, and an email; (d) a statement by you that you have a good faith belief that use of
        the material is not authorized by the copyright owners; and (e) a statement that the information in the
        notification is accurate, and, under penalty of perjury you are authorized to act on behalf of the owner.{"\n"}
      </Text>
    </View>

    <View>
    <Text style={styles.h1}>
      Indemnification
      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
        You agree to indemnify and hold UltiTracker and its parents, subsidiaries, affiliates, officers, employees,
        agents, partners and licensors (if any) harmless from any claim or demand, including reasonable attorneys'
        fees, due to or arising out of your: (a) use of the app; (b) violation of this Agreement or any law or regulation;
        or (c) violation of any right of a third party.{"\n"}
      </Text>
    </View>

    <View>
    <Text style={styles.h1}>
      No Warranties
      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
      The app is provided to you "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty of
any kind. To the maximum extent permitted under applicable law, UltiTracker, on its own behalf and on
behalf of its affiliates and its and their respective licensors and service providers, expressly disclaims all
warranties, whether express, implied, statutory or otherwise, with respect to the app, including all implied
warranties of merchantability, fitness for a particular purpose, title and non-infringement, and warranties that
may arise out of course of dealing, course of performance, usage or trade practice. Without limitation to the
foregoing, UltiTracker provides no warranty or undertaking, and makes no representation of any kind that the
app will meet your requirements, achieve any intended results, be compatible or work with any other
software, apps, systems or services, operate without interruption, meet any performance or reliability
standards or be error free or that any errors or defects can or will be corrected.{"\n"}{"\n"}
Without limiting the foregoing, neither UltiTracker nor any UltiTracker's provider makes any representation or
warranty of any kind, express or implied: (i) as to the operation or availability of the app, or the information,
content, and materials or products included thereon; (ii) that the app will be uninterrupted or error-free; (iii) as
to the accuracy, reliability, or currency of any information or content provided through the app; or (iv) that the
app, its servers, the content, or e-mails sent from or on behalf of UltiTracker are free of viruses, scripts,
trojan horses, worms, malware, timebombs or other harmful components.{"\n"}{"\n"}
Some jurisdictions do not allow the exclusion of or limitations on implied warranties or the limitations on the
applicable statutory rights of a consumer, so some or all of the above exclusions and limitations may not
apply to you.{"\n"}
        </Text>
      </View>

      <View>
    <Text style={styles.h1}>
      Limitation of Liability
      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
      Notwithstanding any damages that you might incur, the entire liability of UltiTracker and any of its suppliers
under any provision of this Agreement and your exclusive remedy for all of the foregoing shall be limited to
the amount actually paid by you for the app.{"\n"}{"\n"}
To the maximum extent permitted by applicable law, in no event shall UltiTracker or its suppliers be liable for
any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to,
damages for loss of profits, for loss of data or other information, for business interruption, for personal injury,
for loss of privacy arising out of or in any way related to the use of or inability to use the app, third-party
software and/or third-party hardware used with the app, or otherwise in connection with any provision of this
Agreement), even if UltiTracker or any supplier has been advised of the possibility of such damages and
even if the remedy fails of its essential purpose.{"\n"}{"\n"}
Some states/jurisdictions do not allow the exclusion or limitation of incidental or consequential damages, so
the above limitation or exclusion may not apply to you{"\n"}
        </Text>
      </View>
      <View>
    <Text style={styles.h1}>
      Severability
      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
      If any provision of this Agreement is held to be unenforceable or invalid, such provision will be changed and
interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable
law and the remaining provisions will continue in full force and effect.{"\n"}{"\n"}
This Agreement, together with the Privacy Policy and any other legal notices published by UltiTracker on the
Services, shall constitute the entire agreement between you and UltiTracker concerning the Services. If any
provision of this Agreement is deemed invalid by a court of competent jurisdiction, the invalidity of such
provision shall not affect the validity of the remaining provisions of this Agreement, which shall remain in full
force and effect. No waiver of any term of this Agreement shall be deemed a further or continuing waiver of
such term or any other term, and UltiTracker's failure to assert any right or provision under this Agreement
shall not constitute a waiver of such right or provision. YOU AND UltiTracker AGREE THAT ANY CAUSE OF
ACTION ARISING OUT OF OR RELATED TO THE SERVICES MUST COMMENCE WITHIN ONE (1)
YEAR AFTER THE CAUSE OF ACTION ACCRUES. OTHERWISE, SUCH CAUSE OF ACTION IS
PERMANENTLY BARRED{"\n"}
        </Text>
      </View>
      <View>
    <Text style={styles.h1}>
      Waiver
      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
      Except as provided herein, the failure to exercise a right or to require performance of an obligation under this
Agreement shall not effect a party's ability to exercise such right or require such performance at any time
thereafter nor shall be the waiver of a breach constitute waiver of any subsequent breach.{"\n"}{"\n"}
No failure to exercise, and no delay in exercising, on the part of either party, any right or any power under
this Agreement shall operate as a waiver of that right or power. Nor shall any single or partial exercise of any
right or power under this Agreement preclude further exercise of that or any other right granted herein. In the
event of a conflict between this Agreement and any applicable purchase or other terms, the terms of this
Agreement shall govern.{"\n"}
        </Text>
      </View>
      <View>
    <Text style={styles.h1}>
      Amendments to this Agreement
      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
      UltiTracker reserves the right, at its sole discretion, to modify or replace this Agreement at any time. If a
revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What
constitutes a material change will be determined at our sole discretion.{"\n"}{"\n"}
By continuing to access or use our app after any revisions become effective, you agree to be bound by the
revised terms. If you do not agree to the new terms, you are no longer authorized to use UltiTracker.{"\n"}

        </Text>
      </View>
      <View>
    <Text style={styles.h1}>
    Entire Agreement

      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
      The Agreement constitutes the entire agreement between you and UltiTracker regarding your use of the app
and supersedes all prior and contemporaneous written or oral agreements between you and UltiTracker.{"\n"}{"\n"}
You may be subject to additional terms and conditions that apply when you use or purchase other
UltiTracker's services, which UltiTracker will provide to you at the time of such use or purchase.{"\n"}

        </Text>
      </View>
      <View>
    <Text style={styles.h1}>
    Updates to Our Terms
      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
      We may change our Service and policies, and we may need to make changes to these Terms so that they
accurately reflect our Service and policies. Unless otherwise required by law, we will notify you (for example,
through our Service) before we make changes to these Terms and give you an opportunity to review them
before they go into effect. Then, if you continue to use the Service, you will be bound by the updated Terms.
If you do not want to agree to these or any updated Terms, you can delete your account.{"\n"}

        </Text>
      </View>
      <View>
    <Text style={styles.h1}>
    Intellectual Property
      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
      The app and its entire contents, features and functionality (including but not limited to all information,
software, text, displays, images, video and audio, and the design, selection and arrangement thereof), are
owned by UltiTracker, its licensors or other providers of such material and are protected by Ireland and
international copyright, trademark, patent, trade secret and other intellectual property or proprietary rights
laws. The material may not be copied, modified, reproduced, downloaded or distributed in any way, in whole
or in part, without the express prior written permission of UltiTracker, unless and except as is expressly
provided in these Terms & Conditions. Any unauthorized use of the material is prohibited.{"\n"}

        </Text>
      </View>
      <View>
    <Text style={styles.h1}>
    Agreement to Arbitrate

      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
      This section applies to any dispute EXCEPT IT DOESN'T INCLUDE A DISPUTE RELATING TO CLAIMS
FOR INJUNCTIVE OR EQUITABLE RELIEF REGARDING THE ENFORCEMENT OR VALIDITY OF YOUR
OR UltiTracker's INTELLECTUAL PROPERTY RIGHTS. The term “dispute” means any dispute, action, or
other controversy between you and UltiTracker concerning the Services or this agreement, whether in
contract, warranty, tort, statute, regulation, ordinance, or any other legal or equitable basis. “Dispute” will be
given the broadest possible meaning allowable under law.{"\n"}

        </Text>
      </View>
      <View>
    <Text style={styles.h1}>
    Notice of Dispute
      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
      In the event of a dispute, you or UltiTracker must give the other a Notice of Dispute, which is a written
statement that sets forth the name, address, and contact information of the party giving it, the facts giving
rise to the dispute, and the relief requested. You must send any Notice of Dispute via email to:
contact@ultitracker.pro. UltiTracker will send any Notice of Dispute to you by mail to your address if we have
it, or otherwise to your email address. You and UltiTracker will attempt to resolve any dispute through
informal negotiation within sixty (60) days from the date the Notice of Dispute is sent. After sixty (60) days,
you or UltiTracker may commence arbitration.
{"\n"}

        </Text>
      </View>
      <View>
    <Text style={styles.h1}>
    Binding Arbitration

      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
      If you and UltiTracker don’t resolve any dispute by informal negotiation, any other effort to resolve the
dispute will be conducted exclusively by binding arbitration as described in this section. You are giving up the
right to litigate (or participate in as a party or class member) all disputes in court before a judge or jury. The
dispute shall be settled by binding arbitration in accordance with the commercial arbitration rules of the
American Arbitration Association. Either party may seek any interim or preliminary injunctive relief from any
court of competent jurisdiction, as necessary to protect the party’s rights or property pending the completion
of arbitration. Any and all legal, accounting, and other costs, fees, and expenses incurred by the prevailing
party shall be borne by the non-prevailing party.{"\n"}

        </Text>
      </View>
      <View>
    <Text style={styles.h1}>
    Submissions and Privacy

      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
      In the event that you submit or post any ideas, creative suggestions, designs, photographs, information,
advertisements, data or proposals, including ideas for new or improved products, services, features,
technologies or promotions, you expressly agree that such submissions will automatically be treated as
non-confidential and non-proprietary and will become the sole property of UltiTracker without any
compensation or credit to you whatsoever. UltiTracker and its affiliates shall have no obligations with respect
to such submissions or posts and may use the ideas contained in such submissions or posts for any
purposes in any medium in perpetuity, including, but not limited to, developing, manufacturing, and marketing
products and services using such ideas.{"\n"}

        </Text>
      </View>
      <View>
    <Text style={styles.h1}>
    Promotions
      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
      UltiTracker may, from time to time, include contests, promotions, sweepstakes, or other activities
(“Promotions”) that require you to submit material or information concerning yourself. Please note that all
Promotions may be governed by separate rules that may contain certain eligibility requirements, such as
restrictions as to age and geographic location. You are responsible to read all Promotions rules to determine
whether or not you are eligible to participate. If you enter any Promotion, you agree to abide by and to
comply with all Promotions Rules.{"\n"}{"\n"}
Additional terms and conditions may apply to purchases of goods or services on or through the Services,
which terms and conditions are made a part of this Agreement by this reference{"\n"}

        </Text>
      </View>
      <View>
    <Text style={styles.h1}>
    Typographical Errors
      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
      In the event a product and/or service is listed at an incorrect price or with incorrect information due to
typographical error, we shall have the right to refuse or cancel any orders placed for the product and/or
service listed at the incorrect price. We shall have the right to refuse or cancel any such order whether or not
the order has been confirmed and your credit card charged. If your credit card has already been charged for
the purchase and your order is canceled, we shall immediately issue a credit to your credit card account or
other payment account in the amount of the charge.{"\n"}

        </Text>
      </View>
      <View>
    <Text style={styles.h1}>
    Miscellaneous
      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
      If for any reason a court of competent jurisdiction finds any provision or portion of these Terms & Conditions
to be unenforceable, the remainder of these Terms & Conditions will continue in full force and effect. Any
waiver of any provision of these Terms & Conditions will be effective only if in writing and signed by an
authorized representative of UltiTracker. UltiTracker will be entitled to injunctive or other equitable relief
(without the obligations of posting any bond or surety) in the event of any breach or anticipatory breach by
you. UltiTracker operates and controls the UltiTracker Service from its offices in Ireland. The Service is not
intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution
or use would be contrary to law or regulation. Accordingly, those persons who choose to access the
UltiTracker Service from other locations do so on their own initiative and are solely responsible for
compliance with local laws, if and to the extent local laws are applicable. These Terms & Conditions (which
include and incorporate the UltiTracker Privacy Policy) contains the entire understanding, and supersedes all
prior understandings, between you and UltiTracker concerning its subject matter, and cannot be changed or
modified by you. The section headings used in this Agreement are for convenience only and will not be given
any legal import.
{"\n"}

        </Text>
      </View>
      <View>
    <Text style={styles.h1}>
    Disclaimer
      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
      UltiTracker is not responsible for any content, code or any other imprecision.{"\n"}{"\n"}
      UltiTracker does not provide warranties or guarantees.{"\n"}{"\n"}
      In no event shall UltiTracker be liable for any special, direct, indirect, consequential, or incidental damages or
any damages whatsoever, whether in an action of contract, negligence or other tort, arising out of or in
connection with the use of the Service or the contents of the Service. The Company reserves the right to
make additions, deletions, or modifications to the contents on the Service at any time without prior notice.{"\n"}{"\n"}
The UltiTracker Service and its contents are provided "as is" and "as available" without any warranty or
representations of any kind, whether express or implied. UltiTracker is a distributor and not a publisher of the
content supplied by third parties; as such, UltiTracker exercises no editorial control over such content and
makes no warranty or representation as to the accuracy, reliability or currency of any information, content,
service or merchandise provided through or accessible via the UltiTracker Service. Without limiting the
foregoing, UltiTracker specifically disclaims all warranties and representations in any content transmitted on
or in connection with the UltiTracker Service or on sites that may appear as links on the UltiTracker Service,
or in the products provided as a part of, or otherwise in connection with, the UltiTracker Service, including
without limitation any warranties of merchantability, fitness for a particular purpose or non-infringement of
third party rights. No oral advice or written information given by UltiTracker or any of its affiliates, employees,
officers, directors, agents, or the like will create a warranty. Price and availability information is subject to
change without notice. Without limiting the foregoing, UltiTracker does not warrant that the UltiTracker
Service will be uninterrupted, uncorrupted, timely, or error-free.{"\n"}

        </Text>
      </View>
      <View>
    <Text style={styles.h1}>
    Contact Us
      </Text>
      <View style={styles.border}></View>
      <Text style={styles.h4}>
      Don't hesitate to contact us if you have any questions.{"\n"}{"\n"}
      <TouchableOpacity onPress={() => goToLink('mailto:contact@ultitracker.pro')}>
          <Text style={{color: colors.blue, fontWeight: '900', fontSize: 20}}>
          Via Email: contact@ultitracker.pro{"\n"}
          </Text>
      </TouchableOpacity>
      

        </Text>
      </View>
      </View>
      </View>
  )    
  }

  return (
    <SafeAreaProvider style={{backgroundColor: 'white', minHeight: screenHeight}}>
      <ScrollView contentContainerStyle={styles.viewWrapper}>
        {
          showPrivacyPolicy &&
          <PrivacyPolicy />
        }
        {
          showTermsAndConditions &&
          <TermsOfService />
        }
        {
          !showPrivacyPolicy && !showTermsAndConditions &&
          <>
        <View style={{display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', marginBottom: 30}}>
          <MaterialCommunityIcons name="poll" color={colors.text} size={50} style={{marginRight: 10,}}/>
          <Text style={styles.title}>Ulti Tracker</Text>
        </View>

        <View style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          {
            isInSignUpMode &&
            <>
            <Text style={{fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 10,}}>Create an account</Text>
            <View style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center',}}>
              <Text style={{fontWeight: '600', fontSize: 16}}>Already have an account?</Text>
              <TouchableOpacity onPress={() => setIsInSignUpMode(false)}>
                <Text style={{color: colors.blue, fontWeight: '600', fontSize: 16}}> Login</Text>
              </TouchableOpacity> 
            </View>
           
            </>
            
          }
          {
            !isInSignUpMode &&
            <>
            <Text style={{fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 10,}}>Login</Text>
            <View style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 30,}}>
              <Text style={{fontWeight: '600', fontSize: 16}}>Dont have an account?</Text>
              <TouchableOpacity onPress={() => setIsInSignUpMode(true)}>
                <Text style={{color: colors.blue, fontWeight: '600', fontSize: 16}}> Signup</Text>
              </TouchableOpacity> 
            </View>
           
            </>
            
          }
        </View>
        
        <Input
          placeholder="email"
          onChangeText={setEmail}
          autoCapitalize="none"
          style={[styles.input, {marginTop: 30,}]}
        />
        { isInSignUpMode &&
        <>
          <Input
            placeholder="first name"
            onChangeText={setFirstName}
            autoCapitalize="none"
            style={styles.input}
          />
          <Input
            placeholder="surname"
            onChangeText={setSurname}
            autoCapitalize="none"
            style={styles.input}
          />
          <Input
            placeholder="username"
            onChangeText={setUsername}
            autoCapitalize="none"
            style={styles.input}
          />
        </>
        }
        
        
        <Input
          placeholder="password"
          onChangeText={setPassword}
          secureTextEntry={passwordHidden}
          style={styles.input}
          rightIcon={
            <TouchableOpacity onPress={() => setPasswordHidden(!passwordHidden)}>
              {
                passwordHidden &&
                <MaterialCommunityIcons name="eye-off-outline" color={colors.text} size={40} style={{marginRight: 10,}}/>
              }
              {
                !passwordHidden && 
                <MaterialCommunityIcons name="eye-outline" color={colors.text} size={40} style={{marginRight: 10,}}/>
              }
              
            </TouchableOpacity>
          }
        />

        {
          !isInSignUpMode &&
          <TouchableOpacity onPress={onPressSignIn} style={[styles.button, shadow.shadow]}>
            <Text style={{fontWeight: '800', fontSize: 20, color: 'white'}}>Login</Text>
          </TouchableOpacity>
        }
        {
          isInSignUpMode &&
          <TouchableOpacity onPress={onPressSignUp} style={[styles.button, shadow.shadow]}>
            <Text style={{fontWeight: '800', fontSize: 20, color: 'white'}}>Signup</Text>
          </TouchableOpacity>
        }

        <View style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginBottom: 20,}}>
          <View style={styles.border}></View>
          <View>
            {
              isInSignUpMode &&
              <Text style={{color: colors.text, fontWeight: '600',}}>or sign up with</Text>
            }
            {
              !isInSignUpMode &&
              <Text style={{color: colors.text, fontWeight: '600',}}>or sign in with</Text>
            }
          </View>
          <View style={styles.border}></View>
        </View>

        <View style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 50,}}>
          <TouchableOpacity style={[{backgroundColor: '#f3f3f3', width: 100, height: 70, borderWidth: 2, borderRadius: 15, borderColor: 'lightgray', display: 'flex', justifyContent: 'center', alignItems: 'center'}, shadow.shadow]}>
            <MaterialCommunityIcons name="google" color={colors.blue} size={40}/>
          </TouchableOpacity>
        </View>
        
        {
          isInSignUpMode &&
          <View style={{width: '100%', height: 50, position: 'absolute', bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 30,}}>
          <Text>
            By clicking Create account you agree to UltiTracker's
          </Text>
          <View style={{display: 'flex', flexDirection: 'row', marginBottom: 30,}}>
          <TouchableOpacity onPress={() => {setShowTermsAndConditions(true); setShowPrivacyPolicy(false)}}>
              <Text style={{color: colors.blue, fontWeight: '900'}}>
                  Terms of Service 
              </Text>
          </TouchableOpacity>
          <Text style={{color: colors.text}}>
                   and 
              </Text>
              <TouchableOpacity onPress={() => {setShowPrivacyPolicy(true); setShowTermsAndConditions(false)}}>
              <Text style={{color: colors.blue, fontWeight: '900'}}>
                  Privacy Policy
              </Text>
          </TouchableOpacity>
          </View>

          <Text style={{color: colors.text}}>2024 UltiTracker. All rights reserved.</Text>
          
        </View>
        }
        </>
          }
      </ScrollView>
    </SafeAreaProvider>
  );
}

