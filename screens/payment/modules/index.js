import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Modal,
  SafeAreaView,
  Linking,
} from 'react-native';
import TouchableCustom from '@helpers/touchable_custom';
import {DeliveryPageStyle} from '../style';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {Icon} from 'native-base';
import {TextField} from 'react-native-material-textfield';
import {SecondaryColor} from '@config/environment';
import {hasNotch} from 'react-native-device-info';
import styles from '../../cart/modules/cart_action/cart_action.style';
import colors from '@config/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {WebView} from 'react-native-webview';
import {ScrollView} from 'react-navigation';

export const DeliveryAddress = ({address, _this}) => {
  const {navigate} = _this.props.navigation;
  return (
    <View style={DeliveryPageStyle.deliveryAddressWrapper}>
      <View>
        <View style={DeliveryPageStyle.nameWrapper}>
          <Text allowFontScaling={false} style={DeliveryPageStyle.name}>
            {address?.firstname} {address?.lastname}
          </Text>
        </View>
        <View style={DeliveryPageStyle.addressDetailWrapper}>
          {address?.street?.[0] ? (
            <Text
              allowFontScaling={false}
              style={DeliveryPageStyle.addressText}>
              {address?.street?.[0]}
            </Text>
          ) : null}
          {address?.city ? (
            <Text
              allowFontScaling={false}
              style={DeliveryPageStyle.addressText}>
              {address.city}
            </Text>
          ) : null}
          {address?.region ? (
            <Text
              allowFontScaling={false}
              style={DeliveryPageStyle?.addressText}>
              {address?.region?.region} - {address?.postcode}
            </Text>
          ) : null}
          {address?.country ? (
            <Text
              allowFontScaling={false}
              style={DeliveryPageStyle.addressText}>
              {address?.country?.country}
            </Text>
          ) : null}
          <Text allowFontScaling={false} style={DeliveryPageStyle.addressText}>
            {address.telephone}
          </Text>
          {address.vat_id ? (
            <Text
              allowFontScaling={false}
              style={DeliveryPageStyle.addressText}>
              GSTIN: {address.vat_id}
            </Text>
          ) : null}
        </View>
        {/* {!address.alternate_mobile?
                    <View style={DeliveryPageStyle.alternate_mobile_field_wrapper}>
                        <View style={DeliveryPageStyle.alternate_mobile_message_wrapper}>
                            <Text allowFontScaling={false} style={DeliveryPageStyle.alternate_mobile_message}>*At the time of delivery in case we are unable to reach you on your primary number, please provide your alternate number.</Text>
                            <TouchableOpacity onPress={()=> _this.toggleAlternateField()}>
                                <Text allowFontScaling={false} style={DeliveryPageStyle.alternate_mobile_button}>{`Click To ${!_this.state.showAlternateField?'Add':'Hide'}`}</Text>
                            </TouchableOpacity>
                        </View>
                        {_this.state.showAlternateField?
                            <View>
                                <TextField
                                    label='Alternate Number'
                                    tintColor={SecondaryColor}
                                    labelHeight={15}
                                    onChangeText={(text) => _this.validate(text)}
                                    value={_this.state.alternateMobile}
                                    clearButtonMode={'always'}
                                    spellCheck={false}
                                    autoCorrect={false}
                                    returnKeyType="done"
                                    onSubmitEditing={()=> _this.addAlternateNumber(address)}
                                    blurOnSubmit={false}
                                    autoCapitalize={'none'}
                                    underlineColorAndroid={'transparent'}
                                    keyboardType = {'numeric'}
                                    fontSize={12}
                                    error={_this.state.alternateMobileError}
                                    containerStyle={DeliveryPageStyle.textField}
                                />
                            </View>
                            : null
                        }
                    </View>
                    : null
                } */}
        {/*<TouchableCustom
          underlayColor={'#ffffff10'}
          onPress={() =>
            _this.state.showAlternateField
              ? _this.addAlternateNumber(address)
              : navigate('Address', {checkout: true})
          }>
          <View style={DeliveryPageStyle.buttonWrapper}>
            <Text allowFontScaling={false} style={DeliveryPageStyle.buttonText}>
              {_this.state.showAlternateField ? 'Save' : 'Change/Add Address'}
            </Text>
          </View>
        </TouchableCustom>*/}
      </View>
    </View>
  );
};

export const Payments = ({_this, item}) => {
  return (
    <TouchableCustom
      underlayColor={'#ffffff10'}
      onPress={() => _this.setState({selectedMethodCode: item})}>
      <View style={DeliveryPageStyle.methodWrapper}>
        <View style={DeliveryPageStyle.paymentTitleWrapper}>
          <Text allowFontScaling={false} style={DeliveryPageStyle.paymentTitle}>
            {item.title}
          </Text>
        </View>
        <View style={DeliveryPageStyle.paymentRadioIconWrapper}>
          <MIcon
            name={`radio-button-${
              _this.state.selectedMethodCode?.code === item?.code
                ? 'checked'
                : 'unchecked'
            }`}
            size={18}
            style={DeliveryPageStyle.radioOff}
          />
        </View>
      </View>
    </TouchableCustom>
  );
};

export const DeliveryAction = ({priceDetails, _this}) => {
  const [isChecked, setIsChecked] = useState(true);
  const [showTermConditions, setShowTermConditions] = useState(false);

  var buttonDisabled = !isChecked
    ? true
    : _this.state.registrationNoRequired === true &&
      (_this.state.registrationNo === null ||
        _this.state.registrationNo === undefined)
    ? true
    : _this.state.selectedMethodCode
    ? false
    : true;

  const openUrl = url => {
    try {
      this.requestAnimationFrame(() => {
        Linking.canOpenURL(url)
          .then(supported => {
            if (!supported) {
              console.log("Can't handle url: " + url);
            } else {
              return Linking.openURL(url);
            }
          })
          .catch(err => console.log('An error occurred', err));
      });
    } catch (error) {
      console.log('An error occurred', error);
    }
  };

  const showWebViewModal = () => (
    <Modal
      animationIn="slideInRight"
      animationOut="slideOutRight"
      deviceWidth={1}
      deviceHeight={1}
      isVisible={showTermConditions}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.modalContainer}>
          <View style={[styles.row, styles.spaceBetween]}>
            <Text allowFontScaling={false} style={styles.heading}>
              TERMS AND CONDITIONS
            </Text>
            <TouchableOpacity
              onPress={() => setShowTermConditions(false)}
              style={styles.modalHeader}>
              <Ionicons name="ios-close-circle-outline" size={30} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text allowFontScaling={false} style={styles.subHeading}>
              Welcome to Dentalkart.com
            </Text>
            <Text allowFontScaling={false} style={styles.body}>
              Dentalkart is registered with VASA Denticity Pvt. Ltd.
            </Text>
            <Text allowFontScaling={false} style={styles.body}>
              With any purchase from Dentalkart.com website/app, customer
              unconditionally agrees to the terms and conditions mentioned below
              even if you have read them or not. Please read this agreement
              carefully before proceeding, as customer is bound to these
              conditions for accessing, browsing or purchase. If you (customer)
              do not agree and accept any of the terms, conditions and policies
              unconditionally, do not use this platform. According to new
              medical device rules (MDR) it is mandatory to buy from registered
              suppliers like dentalkart and sell to dental/medical council
              registered doctors.{' '}
              <Text
                style={{color: 'blue'}}
                onPress={() =>
                  openUrl(
                    'https://dentalkart-application-media.s3.ap-south-1.amazonaws.com/india-medical-devices-rules-2017.pdf',
                  )
                }>
                Click here
              </Text>{' '}
              for more Details. So it is mandatory to provide the council
              registration number or drug licence number before placing the
              order and Dentalkart will assume that the provided details are
              correct and will not be responsible for any false information
              provided by the customer.
            </Text>
            <Text
              allowFontScaling={false}
              style={[styles.body, styles.withPadding]}>
              These Terms of Use govern all the products offered on the platform
              of Dentalkart.com website/app.
            </Text>
            <Text
              allowFontScaling={false}
              style={(styles.body, styles.withPadding)}>
              Throughout this document, “we”, “us”, “our”, “ours” refer to
              Dentalkart.com website/app. Wherever the text mentions ‘you’ or
              ‘your’, this means YOU (reader/customer).
            </Text>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                1.{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                You acknowledge and undertake that you are wholly responsible
                for your decision to buy any product/products after your own
                analysis, judgement and thereafter transaction done by you on
                this website. Dentalkart.com website/app takes no responsibility
                of the usage, implementation and result/outcome of the products.
                It is entirely buyer’s/user’s responsibility to choose and
                decide the right product.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                2.{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                Dentalkart.com website/app reserves the right to refuse access
                to the website, terminate accounts, remove or edit content at
                any time without any prior notice and with absolute discretion.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                3.{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                In case of any violation of the terms and conditions,
                Dentalkart.com website/app reserves the right to refuse further
                use of services or even terminate account without any prior
                notice.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                4.{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                Entitlement to the goods remains that of Dentalkart.com
                website/app until you have paid for them. Entitlement will pass
                to you once the goods are paid in full and all payments have
                been cleared by a relevant banking process.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                5.{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                Dentalkart.com website/app reserves the right to not allow any
                changes to the order after the order has been accepted/placed.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                6.{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                Dentalkart.com website/app will not be responsible for any
                transactions done by mistake due to any internet issue at
                customer’s end.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                7.{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                All reasonable attempts will be made to ensure that all the
                information given on this website is accurate, but offers no
                liability or assurance of genuineness of the information.
                Dentalkart.com website/app will not be responsible for any
                errors or incomplete information of products on its website.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                8.{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                Dentalkart.com website/app assumes that you are a dental
                clinician or someone who is using it on his/her behalf. Any
                accidental/intentional order placed by someone else is solely
                the responsibility of the account owner.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                9.{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                Customer is solely responsible for the account information like
                username and password and you hereby undertake the
                responsibility of any action taking place in your account.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                10.{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                You acknowledge and agree that any information provided by you
                is only yours and does not infringe the confidentiality of a
                third party/person in any way.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                11.{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                If you are making a purchase on someone else’s behalf, you agree
                and bound the account holder to all the terms and conditions of
                Dentalkart.com website/app.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                12.{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                In case of any knowledge or belief that your information has
                been breached in any way, you must contact Dentalkart.com
                website/app at support@dentalkart.com
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                13.{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                If any issue is suspected as per the confidentiality of your
                account, you might be asked to change your password or
                re-register with no liability of Dentalkart.com website/app.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                14.{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                The pictures of all products at Dentalkart.com website/app are
                merely indicated for information and may vary from the actual
                product. Product packaging also might vary or change from time
                to time
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                15.{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                Dentalkart.com website/app strives to provide accurate product
                and pricing information; however, errors may occur.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                16.{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                Dentalkart.com website/app reserves all rights to change/alter
                prices of any product and suspend/cancel orders at any point of
                time unless it has been received by the customer.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                17.{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                No changes can be made to the order once the order has been
                dispatched from our warehouse. However, if you still require to
                contact us then drop us an email at support@dentalkart.com. Our
                dedicated team aims to contact you within 24 hours. If ordered
                by mistake, you can still return the items by simply contacting
                our customer service.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                18.{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                In case of any delays in delivery you may track the status of
                your order by visiting ‘My Orders’. Our aim is to meet the
                delivery times but during busy periods like promotional sale,
                festive occasions, tech updates, extreme weather conditions may
                delay the delivery and it may take a little longer time than
                mentioned. Dentalkart.com website/app will not be responsible
                for any such delays; however, we always work hard to keep these
                temporary changes to a minimum. For any queries related to
                delays you may contact us by dropping an email at
                support@dentalkart.com
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                19.{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                In case of cancellation of the paid order, the paid amount will
                be reversed to the account information provided at the time of
                purchase and Dentalkart.com website/app will not be responsible
                for any accurate time duration taken in the transfer. Transfer
                is solely due as per the time taken by the bank.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                20.{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                If any product is found unavailable after receiving the order,
                customer will be notified of the order cancellation via email
                and payment will be refunded to the same account of the account
                holder from which payment was made. Dentalkart.com website/app
                shall not be liable to any damages in such event/events owing to
                cancellation of the order or delay in delivery.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                21.{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                Payments can be made via debit card, credit card, net banking,
                UPI wallet, Paytm, Mobikwik, cash on delivery as per
                availability of services by third party companies.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                22.{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                If you use the Dentalkart.com website/app, you are responsible
                for maintaining the confidentiality of your account and password
                and for restricting access to your computer to prevent
                unauthorised access to your account. You agree to accept
                responsibility for all activities that occur under your account
                or password.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                23.{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                We will do our utmost to ensure that availability of the website
                will be uninterrupted and that transmissions will be error-free.
                However, this cannot be guaranteed due to nature of the
                Internet. Also, your access to the website may also be
                occasionally suspended or restricted to allow for repairs,
                maintenance, or the introduction of new features or services at
                any time without prior notice. We will attempt to limit the
                frequency and duration of any such suspension or restriction.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                24.{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                Any content of this website must not be copied, reproduced,
                sold/resold or duplicated for any commercial activity without
                prior written consent of Vasa Denticity pvt. ltd.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                25.{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                You must not use this website for any fraudulent/unlawful
                activity whatsoever.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                26.{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                Any dispute will be subjected to Delhi jurisdiction only.
              </Text>
            </View>
            <Text allowFontScaling={false} style={styles.subHeading}>
              Cancellation Policy
            </Text>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                1.{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                In order to cancel the order before the shipment of the
                product/products, customer has to go to ‘My Orders’ and cancel
                the order or else contact support@dentalkart.com
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                2.{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                In order to cancel the order after the shipment of the
                product/products, customer has to contact support@dentalkart.com
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                3.{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                Refund is processed within 24-48 business hours when order
                stands cancelled before/after shipment. We process the refund
                once the products have been received and verified at our
                warehouse.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                4.{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                Refund in case of cancellation after dispatch might take longer.
              </Text>
            </View>
            <Text allowFontScaling={false} style={styles.subHeading}>
              Return/Replacement Policy
            </Text>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                In case of returns, Dentalkart.com website/app arranges pick-up
                of the goods but shipping charges will be applicable. Customer
                has to bear the shipping charges or else can arrange the return
                by own means.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                The product must be returned in its original packaging with all
                contents intact as shipped.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                A part of the order can also be returned if multiple items were
                ordered. However, all the components of the product must be
                intact and product should ne unused/altered.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                In case of a return/replacement/refund, we process the refund
                once the products have been received and verified at our
                warehouse.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                In case of cancellation before shipment, we process the refund
                within 24-48 business hours after receiving the cancellation
                request.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                In case of cancellation once the shipment has already been
                dispatched or if it is being returned, we process the refund
                once the products have been received and verified at our
                warehouse.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                For payments done through credit/debit cards or net banking, the
                refund will be processed to the same account from which the
                payment was made within 24-48 business hours of us receiving the
                products back. It may take 2-3 additional business days for the
                amount to reflect in your account.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                For cash on delivery transactions, we will initiate a bank
                transfer against the refund amount against the billing details
                shared by you. This process will be completed within 24-48
                business hours of us receiving the products back and your bank
                details on email. It will take an additional 2-3 business days
                for the amount to reflect in your account.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                Equipment which cannot be returned include Dental chairs, Dental
                compressors, UV chambers, autoclaves, X-ray units, RVG sensor
                machine, Model trimmers, OPG and CBCT machines, apex locators,
                endomotors, Ultasonic scalers, Micromotors, Physio dispenser,
                Bleaching light and other light curing units, amalgamator etc.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                Products which are not applicable for returns include tooth
                crème/mousse, MRC/orthodontic trainers, water flossers, chin
                caps, headgears, face masks or other myofunctional appliances.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                For more information:{' '}
                <Text
                  style={{color: 'blue'}}
                  onPress={() =>
                    openUrl('https://www.dentalkart.com/return-policy')
                  }>
                  Click here
                </Text>{' '}
                Items which are not applicable for returns:
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                Product is damaged due to misuse/overuse
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                Returned without original packaging including, price tags,
                labels, original packing and/or any attachments or if original
                packaging is damaged
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                If Serial Number is tampered.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                Defective products that are not covered under
                Company’s/Manufacturer’s warranty
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                Product is used or altered
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                If request is initiated after 10 business days of order delivery
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                No returns of free product/products
              </Text>
            </View>
            <Text allowFontScaling={false} style={styles.subHeading}>
              Refund Policy
            </Text>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                For payments done through credit/debit cards or net banking, the
                refund will be processed to the same account from which the
                payment was made within 24-48 business hours of us receiving the
                products back. It may take 2-3 additional business days for the
                amount to reflect in your account.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                For cash on delivery transactions, we will initiate a bank
                transfer against the refund amount against the billing details
                shared by you. This process will be completed within 24-48
                business hours of us receiving the products back and your bank
                details on email. It might take an additional 2-3 business days
                (might take 7-10 days in some cases) for the amount to reflect
                in your account.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                We also offer refund option via Dentalkart coupon which will be
                added immediately while bank account refund might take 7-10
                days. Both options are available to the buyer as per his/her
                suitability.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                For more information:
                <Text
                  style={{color: 'blue'}}
                  onPress={() =>
                    openUrl(
                      'https://www.dentalkart.com/help-center/questions/4/Refunds',
                    )
                  }>
                  Click here
                </Text>{' '}
              </Text>
            </View>
            <Text allowFontScaling={false} style={styles.subHeading}>
              Privacy Policy
            </Text>
            <Text allowFontScaling={false} style={styles.body}>
              This Privacy Policy outlines approach of Dentalkart.com
              website/app to Data Protection and Privacy to fulfil its
              obligations under the applicable laws and regulations. This
              Privacy Policy applies to your Personal information which is
              processed by us, whether in physical or electronic form.
              Dentalkart.com website/app is committed to treating your privacy
              seriously. It is important that you know as to what we do with
              your provided information. The information we receive and gather
              from you, personal or otherwise, is used to register you, verify
              your identity to permit you to use the app, undertake transactions
              for payments, to communicate with you, to inform for any
              promotional offers, services or updates associated with
              Dentalkart.com website/app, and to generally maintain your account
              information with us. We also use this information to customize
              your experience and improve Dentalkart.com website/app.
            </Text>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                We understand that your personal information is important and
                sensitive so must be safeguarded, thereby every attempt is made
                to ensure protection of the same.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                You can choose not to provide certain information, but then you
                might not be able to use Dentalkart.com website/app.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                If you continue to use this website, it implies that you have
                read these terms and conditions along with the changes made to
                it time and again.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                Therefore, it is advised that you visit the ‘Terms and
                conditions’ page frequently for any modifications made to it.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                By agreeing to the terms and conditions you are giving your
                consent to Dentalkart.com website/app to use your personal
                information.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                We might receive information about you from other sources, such
                as updated delivery and address information from our courier
                partners, which we use to correct our records and deliver your
                next purchase a better experience.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                Data/information recorded may include: name, contact number,
                email address, shipping address, date of birth, country or
                citizenship and transaction details like name of bank, branch
                name, card number, type of card and transaction number.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                Technical details which will be recorded are location, device
                information and network carrier used for the device.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                Location details such as IP address and your location at the
                time of place of order.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                Other details such as pages viewed at Dentalkart.com website/app
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                For more information:{' '}
                <Text
                  style={{color: 'blue'}}
                  onPress={() =>
                    openUrl('https://www.dentalkart.com/privacy-policy')
                  }>
                  Click here
                </Text>{' '}
              </Text>
            </View>
            <Text allowFontScaling={false} style={styles.subHeading}>
              Loyalty Reward Coins
            </Text>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                Reward coins are added to your Dentalkart.com website/app
                account only on the purchase of the specific products that are
                assigned with reward coins.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                Reward coins will be credited to your account upon the
                successful delivery of the ordered products.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                Reward coins can be redeemed only in your next purchase with us.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                Reward coins are applied to only 5% of your total cart value and
                remaining reward coins will remain pending in your account for
                future orders.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                Earned reward coins have an expiration date, hence all the coins
                must be utilised before the expiry.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                The validity of each reward coin is 60 days from the day of
                successful earning. After 60 days all the reward coins in that
                transaction will be expired and you cannot claim them for future
                purchase.
              </Text>
            </View>
            <View style={styles.row}>
              <Text allowFontScaling={false} style={styles.body}>
                -{' '}
              </Text>
              <Text allowFontScaling={false} style={styles.body}>
                For more information:
                <Text
                  style={{color: 'blue'}}
                  onPress={() =>
                    openUrl(
                      'https://www.dentalkart.com/help-center/questions/12/Rewards',
                    )
                  }>
                  Click here
                </Text>{' '}
              </Text>
            </View>
            <Text allowFontScaling={false} style={styles.subHeading}>
              Limited Licensure
            </Text>
            <Text allowFontScaling={false} style={styles.body}>
              Dentalkart.com website/app grants you limited, non-exclusive,
              non-transferable, non- sublicensable license to access, and make
              personal or/and commercial use of the platform. All rights not
              expressly granted to you in these Terms of Use, are reserved and
              retained by the Dentalkart.com website/app and its affiliates.
            </Text>
            <Text
              allowFontScaling={false}
              style={[styles.body, styles.withPadding]}>
              Dentalkart.com website/app reserves the right, at any time,
              without notice and at its sole discretion, to terminate your
              license to use the website and to block and prevent your future
              access of the website.
            </Text>
            <Text allowFontScaling={false} style={styles.subHeading}>
              General
            </Text>
            <Text allowFontScaling={false} style={styles.body}>
              You acknowledge and hereby agree to the above given ‘Terms and
              Conditions’ and that it constitutes the complete and exclusive
              agreement between us concerning your use of the Dentalkart.com
              website/app, and supersede and govern all prior proposals,
              agreements, or other communications.
            </Text>
            <Text
              allowFontScaling={false}
              style={[styles.body, styles.withPadding]}>
              We reserve the right in our sole discretion, to change/ alter/
              modify these Terms and Conditions at any time by posting the
              changes on the Dentalkart.com website/app. Any changes are
              effective immediately upon posting to the Dentalkart.com
              website/app. Your continued use of the Dentalkart.com website/app
              thereafter constitutes your agreement to all such changed ‘Terms
              and Conditions’. We may, with or without prior notice, terminate
              any of the rights granted by these ‘Terms and Conditions’. You
              shall comply immediately with any termination or other notice,
              including, as applicable, by ceasing all use of the Site.
            </Text>
            <Text allowFontScaling={false} style={styles.subHeading}>
              Contact Information
            </Text>
            <Text allowFontScaling={false} style={styles.body}>
              Vasa Denticity Pvt. Ltd.{'\n'}
              Khasra No. 714, Village, P.O.,Chattarpur,{'\n'}
              Opp. DLF gate no.-2, Near Geetanjali salon,{'\n'}
              New Delhi,India, 110074{'\n'}
              Ph: +91-728-9999-456
            </Text>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <View style={DeliveryPageStyle.deliveryActionContainer}>
      {/* {!buttonDisabled?
                <Text allowFontScaling={false} style={DeliveryPageStyle.errorText}>
                    Please make sure that you have selected your current country delivery address.
                </Text>
            : null} */}
      {showTermConditions && showWebViewModal()}
      <Pressable
        onPress={() => setIsChecked(!isChecked)}
        style={styles.checkBoxContainer}>
        <View
          style={[
            styles.checkBoxView,
            {
              borderColor: isChecked ? colors.blueColor : colors.otpBorder,
            },
          ]}>
          {isChecked ? (
            <Icon
              name="check"
              type="AntDesign"
              style={{fontSize: 12, color: colors.blueColor}}
            />
          ) : null}
        </View>
        <TouchableOpacity onPress={() => setShowTermConditions(true)}>
          <Text allowFontScaling={false} style={styles.conditionText}>
            I have read and agree to the terms & conditions
          </Text>
        </TouchableOpacity>
      </Pressable>
      <View style={DeliveryPageStyle.deliveryActionWrapper}>
        <View style={DeliveryPageStyle.shortSummaryWrapper}>
          <Text allowFontScaling={false} style={DeliveryPageStyle.totalText}>
            Total Payable Amount
          </Text>
          <Text
            allowFontScaling={false}
            style={DeliveryPageStyle.shortSummaryPrice}>
            {priceDetails?.grand_total?.currency}{' '}
            {priceDetails?.grand_total?.value}
          </Text>
        </View>
        <View
          style={[
            DeliveryPageStyle.continueButtonWrapper,
            hasNotch() ? DeliveryPageStyle.buttonNotchIssue : '',
          ]}>
          <TouchableCustom
            underlayColor="#ffffff10"
            onPress={() =>
              !_this.state.showCircularProgress ? _this.placeOrder() : null
            }
            disabled={buttonDisabled}>
            <View
              style={[
                DeliveryPageStyle.placeOrderButton,
                buttonDisabled ? DeliveryPageStyle.disabled : null,
              ]}>
              {_this.state.showCircularProgress ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text
                  allowFontScaling={false}
                  style={DeliveryPageStyle.placeOrderButtonText}>
                  Place Order
                </Text>
              )}
            </View>
          </TouchableCustom>
        </View>
      </View>
    </View>
  );
};
