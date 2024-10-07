import Toast from 'react-native-toast-message';

export const showErrorMessage = (message, pos) => {
  var errStr = message;
  errStr = errStr.replace('Error: GraphQL error: ', '');
  errStr = errStr.replace('GraphQL error: ', '');
  const extractJSON = str => {
    var firstOpen, firstClose, candidate;
    firstOpen = str.indexOf('{', firstOpen + 1);
    do {
      firstClose = str.lastIndexOf('}');
      if (firstClose <= firstOpen) {
        return null;
      }
      do {
        candidate = str.substring(firstOpen, firstClose + 1);
        try {
          var res = JSON.parse(candidate);
          return [res, firstOpen, firstClose + 1];
        } catch (e) {}
        firstClose = str.substr(0, firstClose).lastIndexOf('}');
      } while (firstClose > firstOpen);
      firstOpen = str.indexOf('{', firstOpen + 1);
    } while (firstOpen != -1);
  };
  let newArray = extractJSON(errStr);
  if (Array.isArray(newArray)) {
    errStr = newArray?.[0]?.message;
  }
  // console.warn('errStr ======================== > ' ,errStr);
  // Toast.showWithGravity(errStr, Toast.LONG, Toast.BOTTOM);
  Toast.show({
    position: pos ? pos : 'bottom',
    text2: errStr,
    autoHide: true,
    visibilityTime: 3000,
    type: 'error',
  });

  // Toast.show({
  //   type: 'success',
  //   props: { uuid: 'bba1a7d0-6ab2-4a0a-a76e-ebbe05ae6d70' }
  // });
};

export const showSuccessMessage = (message, pos) => {
  var errStr = message;
  errStr = errStr.replace('Error: GraphQL error: ', '');
  errStr = errStr.replace('GraphQL error: ', '');
  Toast.show({
    text2: errStr,
    position: pos ? pos : 'bottom',
    autoHide: true,
    visibilityTime: 3000,
    type: 'success',
  });
};

// export const showSuccessMessage = (message, pos) => {
//   var errStr = message;
//   errStr = errStr.replace('Error: GraphQL error: ', '');
//   errStr = errStr.replace('GraphQL error: ', '');
//   const extractJSON = str => {
//     var firstOpen, firstClose, candidate;
//     firstOpen = str.indexOf('{', firstOpen + 1);
//     do {
//       firstClose = str.lastIndexOf('}');
//       if (firstClose <= firstOpen) {
//         return null;
//       }
//       do {
//         candidate = str.substring(firstOpen, firstClose + 1);
//         try {
//           var res = JSON.parse(candidate);
//           return [res, firstOpen, firstClose + 1];
//         } catch (e) {}
//         firstClose = str.substr(0, firstClose).lastIndexOf('}');
//       } while (firstClose > firstOpen);
//       firstOpen = str.indexOf('{', firstOpen + 1);
//     } while (firstOpen != -1);
//   };
//   let newArray = extractJSON(errStr);
//   if (Array.isArray(newArray)) {
//     errStr = newArray?.[0]?.message;
//   }
//   // console.warn('errStr ======================== > ' ,errStr);
//   // Toast.showWithGravity(errStr, Toast.LONG, Toast.BOTTOM);
//   Toast.show({
//     position: pos ? pos : 'bottom',
//     text2: errStr,
//     autoHide: true,
//     visibilityTime: 3000,
//     type: 'success',
//   });

//   // Toast.show({
//   //   type: 'success',
//   //   props: { uuid: 'bba1a7d0-6ab2-4a0a-a76e-ebbe05ae6d70' }
//   // });
// };

export const showInfoMessage = (message, pos) => {
  var errStr = message;
  errStr = errStr.replace('Error: GraphQL error: ', '');
  errStr = errStr.replace('GraphQL error: ', '');
  Toast.show({
    text2: errStr,
    position: pos ? pos : 'bottom',
    autoHide: true,
    visibilityTime: 3000,
    type: 'info',
  });
};
