

// class ListerInterfaceClass {
//     onChange: any;

//     constructor(onChange: any) {
//         this.onChange = onChange;
//         this.init();
//         this.start();
//     }

//     init = () => {
//         chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            
//             switch (request.type) {
//                 case 'boss-submit':
//                     this.clearValue();
//                     if (!this['boss-onSubmit']) {
//                         // this['boss-onSubmit'] = Math.abs(this['boss-onSubmit'] - request.data.time) <= 20 * 1000 ;
//                     }
                

                    
//                     return;

//                 default:
//                     break;
//             }
//         });

//     }

//     start = () => {
//         //Boss 发布保存接口
//         chrome.webRequest.onCompleted.addListener(details => {
//             this.onChangeValue('boss-onSubmit');
//         }, {
//             urls: ["*://*.zhipin.com/wapi/zpboss/h5/job/save*"],
//         }, [])
//     }

//     clearValue = () => {
//         if (this['boss-onSubmit']) {
//             if (this['boss-onSubmit'] = new Date().getTime() - this['boss-onSubmit'] >= 30 * 1000) {
//                 this['boss-onSubmit'] = null;
//             }
//         }
//     }

//     onChangeValue = (type: string) => {
//         this[type] = new Date().getTime();
//         if (type === 'boss-onSubmit') {
//             if (this['boss-onSubmit']) {
//                 this['boss-onSubmit'] = Math.abs(this['boss-onSubmit'] - request.data.time) <= 30 * 1000 ;
//             }
//         }
//     }


// }


// export default ListerInterfaceClass;
