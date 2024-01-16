import {
  reactExtension,
  useTranslate,
  useEmail,
  usePhone,
  useShippingAddress,
  useBuyerJourneyIntercept,
  Text,
  Link,
  BlockStack,
  useApplyShippingAddressChange,
  useApplyAttributeChange,
  useSubscription
} from '@shopify/ui-extensions-react/checkout';
import React, { useEffect,useState } from 'react'

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {
  const email = useEmail();
  const phone = usePhone();
  const ShippingAddress = useShippingAddress();
  const zipcode = ShippingAddress?.zip;
  const firstName = ShippingAddress?.firstName;
  const lastName = ShippingAddress?.lastName;
  const Address1 = ShippingAddress?.address1;
  const shippingPhone = ShippingAddress?.phone;
  const CityName = ShippingAddress?.city;
  const ShippingAddressChange = useApplyShippingAddressChange();
  const [PincodeData, setPincodeData] = useState();

  const {cost} = useApi();

  
  
  // email & phone validation
  if (phone && email === undefined) {
    useBuyerJourneyIntercept(({ canBlockProgress }) => {
      let Phoneregex = /^[6789][0-9]{4}([ ]?)[0-9]{5}$/;
      return Phoneregex.test(phone) === false
        ? {
            behavior: "block",
            reason: "Invalid Phone Number",
            errors: [
              {
                message: "Please Enter Valid Phone Number",
                target: "$.cart.buyerIdentity.phone",
              }
            ],
          }
        : {
            behavior: "allow",
          };
    });
  } else if (email && phone === undefined) {
    useBuyerJourneyIntercept(({ canBlockProgress }) => {
      let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,12}$/i;
      return emailRegex.test(email) === false
        ? {
            behavior: "block",
            reason: "Invalid Email",
            errors: [
              {
                message: "Please Enter Valid Email Address",
                target: "$.cart.buyerIdentity.email",
              }
            ],
          }
        : {
            behavior: "allow",
          };
    });
  } else if (phone === undefined && email === undefined) {
    useBuyerJourneyIntercept(({ canBlockProgress }) => {
      return {
        behavior: "block",
        reason: "Please Enter Email or Phone",
        errors: [
          {
            message: "Please Enter Email or Phone",
          },
        ],
      };
    });
  }

  //  firstname validation
  if (firstName === undefined) {
    useBuyerJourneyIntercept(({ canBlockProgress }) => {
      return {
        behavior: "block",
        reason: "User name not filled",
        errors: [
          {
            message: "Please Enter First Name",
            target: "$.cart.deliveryGroups[0].deliveryAddress.firstName",
          },
          // {
          //   message: "Please Enter First Name",
          // },
        ],
      };
    });
  }
  else{
    let firstNameLength = firstName.replace(/[, ]/g, "").length;
    let nameRegex = /^[A-Za-z]*$/;
    useBuyerJourneyIntercept(({ canBlockProgress }) => {
      return (firstNameLength === 0 && nameRegex.test(firstName) === true) ||
        (firstNameLength === 0 && nameRegex.test(firstName) === false) ||
        (firstNameLength !== 0 && nameRegex.test(firstName) === false)
        ? {
            behavior: "block",
            reason: "First Name is not filled",
            errors: [
              {
                message: "Please Enter First Name",
                target: "$.cart.deliveryGroups[0].deliveryAddress.firstName",
              }
            ],
          }
        : {
            behavior: "allow",
          };
    });
  }

  // lastname validation
  if (lastName === undefined) {
    useBuyerJourneyIntercept(({ canBlockProgress }) => {
      return {
        behavior: "block",
        reason: "Last name not filled",
        errors: [
          {
            message: "Please Enter Last Name",
            target: "$.cart.deliveryGroups[0].deliveryAddress.lastName",
          },
          // {
          //   message: "Please Enter Last Name",
          // },
        ],
      };
    });
  }
  else{
    let lastNameLength = lastName.replace(/[, ]/g, "").length;
    // console.log("lastNameLength", lastNameLength);
    let lastNameRegex = /^[A-Za-z ]*$/;
    useBuyerJourneyIntercept(({ canBlockProgress }) => {
      return (lastNameLength === 0 && lastNameRegex(lastName) === true) ||
        (lastNameLength === 0 && lastNameRegex.test(lastName) === false) ||
        (lastNameLength !== 0 && lastNameRegex.test(lastName) === false)
        ? {
            behavior: "block",
            reason: "Last name is not valid",
            errors: [
              {
                message: "Please Enter Valid Last Name",
                target: "$.cart.deliveryGroups[0].deliveryAddress.lastName",
              }
            ],
          }
        : {
            behavior: "allow",
          };
    });
  }

  // Address1 validation
  if (Address1 === undefined) {
    useBuyerJourneyIntercept(({ canBlockProgress }) => {
      return {
        behavior: "block",
        reason: "Please Enter Address",
        errors: [
          {
            message: "Please Enter Complete Address",
            target: "$.cart.deliveryGroups[0].deliveryAddress.address1",
          },
        ],
      };
    });
  }
  else{
    var Address1Length = Address1.replace(/[ ]/g, "").length;
    var Address1Regex = /^[a-zA-Z0-9\/#\-_,. ]+$/;
    useBuyerJourneyIntercept(({ canBlockProgress }) => {
      return (Address1Length === 0 && Address1Regex.test(Address1) === true) ||
        (Address1Length === 0 && Address1Regex.test(Address1) === false) ||
        (Address1Length !== 0 && Address1Regex.test(Address1) === false) ||
        (Address1Length < 15 && Address1Regex.test(Address1) === true)
        ? {
            behavior: "block",
            reason: "Invalid Address",
            errors: [
              {
                message: "Please Enter Valid Address",
                target: "$.cart.deliveryGroups[0].deliveryAddress.address1",
              }
            ],
          }
        : {
            behavior: "allow",
          };
    });
  }

  // zipcode validation
  if (zipcode === undefined) {
    useBuyerJourneyIntercept(({ canBlockProgress }) => {
      return {
        behavior: "block",
        reason: "zip is not fulfilled",
        errors: [
          {
            message: "Please Enter Zipcode",
            target: "$.cart.deliveryGroups[0].deliveryAddress.postalCode",
          },
          // {
          //   message: "Please Enter Zipcode",
          // },
        ],
      };
    });
  }
  else{
    
    let zipcodelength = zipcode.replace(/[, ]/g, "");
    let zipcodeRegex = /^[1-9][0-9]{5}$/;
    useBuyerJourneyIntercept(({ canBlockProgress }) => {
      return (zipcodelength === 0 && zipcodeRegex.test(zipcode) === false) ||
        (zipcodelength === 0 && zipcodeRegex.test(zipcode) === true) ||
        (zipcodelength !== 0 && zipcodeRegex.test(zipcode) === false)
        ? {
            behavior: "block",
            reason: "zip is not valid",
            errors: [
              {
                message: "Please Enter Valid Pincode",
                target: "$.cart.deliveryGroups[0].deliveryAddress.postalCode",
              }
            ],
          }
        : {
            behavior: "allow",
          };
    });
  }

  // Country Validation
  useBuyerJourneyIntercept(({ canBlockAdressProgress }) => {
    return ShippingAddress.countryCode !== "IN"
      ? {
          behavior: "block",
          reason: "Invalid shipping country",
          errors: [
            {
              message: "Sorry, we can ship only in INDIA",
              target: "$.cart.deliveryGroups[0].deliveryAddress.countryCode",
            }
          ],
        }
      : {
          behavior: "allow",
        };
  });

  //  Autocomplete City & State
  
  useEffect(() => {
    const apiUrl = `https://api.postalpincode.in/pincode/${zipcode}`;
    let zipcodelength = zipcode.replace(/[, ]/g, "");
    let zipcodeRegex = /^[1-9][0-9]{5}$/;
    console.log("zipcodelength>>>>",zipcodelength)
   if(zipcodelength){
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data received:", data);
        setPincodeData(data[0]?.PostOffice[0]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    }
  }, [zipcode]);

  console.log("PincodeData", PincodeData);


  const AddShippingAddressChange = async () => {
    const code = await ShippingAddressChange({
      type: "updateShippingAddress",
      address: {
        provinceCode: `${PincodeData?.State == 'undefined'}` ? " " : `${PincodeData?.State}`,
        city: `${PincodeData?.Block == 'NA' || 'undefined'}` ? " " : `${PincodeData?.Block}`,
      }
    });
  };

  useEffect(() => {
    AddShippingAddressChange();
  }, [PincodeData]);

  //  CityName validation
  if(CityName ===  'undefined'){
    useBuyerJourneyIntercept(({ canBlockProgress }) => {
      return {
        behavior: "block",
        reason: "Invalid City",
        errors: [
          {
            message: "Please Enter valid city",
            target: "$.cart.deliveryGroups[0].deliveryAddress.city",
          }
        ],
      };
    });
  }
  else{
    const cityNameRegex = /^[A-Za-z ]*(?<!\.{4})[A-Za-z ]*$/;
    const cityNameLength = CityName.length;
    console.log("cityNameLength>>>",cityNameRegex.test(CityName))
    useBuyerJourneyIntercept(({ canBlockProgress }) => {
      return (cityNameLength !== 0 && cityNameRegex.test(CityName) === false)
        ? {
            behavior: "block",
            reason: "Invalid City Name",
            errors: [
              {
                message: "Please Enter Valid City Name",
                target: "$.cart.deliveryGroups[0].deliveryAddress.city",
              }
            ],
          }
        : {
            behavior: "allow",
          };
    });
  }


//  shipping phone number validation
if (shippingPhone === undefined) {
    useBuyerJourneyIntercept(({ canBlockProgress }) => {
      return {
        behavior: "block",
        reason: "Phone is not fulfilled",
        errors: [
          {
            message: "Please enter phone number",
            target: "$.cart.deliveryGroups[0].deliveryAddress.phone",
          },
        ],
      };
    });
  }
  else{
    useBuyerJourneyIntercept(({ canBlockProgress }) => {
          let Phoneregex = /^[6789][0-9]{4}([ ]?)[0-9]{5}$/;
          return Phoneregex.test(shippingPhone) === false
            ? {
                behavior: "block",
                reason: "Invalid Phone Number",
                errors: [
                  {
                    message: "Please Enter Valid Phone Number",
                    target: "$.cart.deliveryGroups[0].deliveryAddress.phone",
                  }
                ],
              }
            : {
                behavior: "allow",
              };
        });
  }

  return null;
}