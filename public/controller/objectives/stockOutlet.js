let stockOutlet = {};
let retailDepletionData = []
const initializeStockVisibility = async () => {
    // let urlParams = new URLSearchParams(window.location.search);
    // const accountId = urlParams.get('accountId');
    const accountId = localStorage.getItem('accountId')
    const key = `${fetchCurrentDateIdStr()}-${accountId}`;
   //  stockOutlet = await getItemFromStore('stockVisibility',key);
    accountRec = await getItemFromStore('account',accountId);
    if(!accountRec){
        accountRec = await getItemFromStore('lead',accountId);
    }
    let kegIds = await getSearchableProducts();
   // if(!stockOutlet){
        let defaultAddedProduct = new Set();
        let recordTypeName = '';
        if(((accountRec.RecordType.DeveloperName).toLowerCase()).indexOf('on') > -1){
            recordTypeName = 'On_Premise';
        }
        else if((accountRec.RecordType.DeveloperName).toLowerCase().indexOf('off') > -1 ){
            recordTypeName = 'Off_Premise_Retail_Account';
        }
        else{
            recordTypeName = 'Others';
        }
        stockOutlet = {
            stockVisibilityChilds : [],
            accountId : accountId ,
            recordTypeName : recordTypeName,
            App_Id : key,
            Created_Date : new Date()
        }; 
        retailDepletionData = accountRec.Retail_Depletion1__r.records;
                if(accountRec.Retail_Depletion1__r){
            let retailDepletionArr = accountRec.Retail_Depletion1__r.records;
            retailDepletionArr = retailDepletionArr.filter(ele => {
                return ele.Last_90_Days__c;
            });
            
            var unique = {};
            var result = [];
          
            for (var i = 0; i < retailDepletionArr.length; i++) {
              var item = retailDepletionArr[i];
              var value = item['Item__c'];
          
              if (!unique[value]) {
                result.push(item);
                unique[value] = true;
              }
            }
            retailDepletionArr = result;
            retailDepletionArr.forEach(ele => {
                if((itemValueMap.has(ele.Item__c)&&!defaultAddedProduct.has(ele.Item__c) )){
                    defaultAddedProduct.add(ele.Item__c);
                    kegIds.delete(ele.Item__c);
                   
                }
            });
            retailDepletionData = retailDepletionArr;
            console.log('retailDepletionArr',retailDepletionArr)
        }
        // console.log('kegIds',kegIds)
        // kegIds.forEach((key,value) => {
        //     if((itemValueMap.has(value)&&!defaultAddedProduct.has(value) )){
        //         defaultAddedProduct.add(value);
                
        //         const productSelected = itemValueMap.get(value);
        //         let product = {
        //             name : (productSelected.Product__c ? (productSelected.Product__r.Display_Name__c) : ''),
        //             mrp : (productSelected.Total_Billing_Price__c ? productSelected.Total_Billing_Price__c : 0),
        //             Item_Master : (productSelected.Product__c),
        //             Quantity : 0
        //         };
        //         stockOutlet.stockVisibilityChilds.push(product);
        //         console.log('product',product)
        //     }
        // });
         
   // }
    // stockOutlet.stockVisibilityChilds.forEach(ele => {
    //     productSelectedTotal.add(ele.Item_Master);
    // });
    
    // stockDetail = stockDetail.concat(stockOutlet.stockVisibilityChilds);
    // console.log('stockDetail',stockOutlet)
    // productList = productList.concat(stockOutlet.stockVisibilityChilds);
    getStockOutletList();
  //  showAccount();
};

const getSearchableProducts = async () => {
    let items = await readAllData('itemMaster');
    let kegsId = new Set();
    console.log('items', items)
    items = items.filter(ele => {
        if(ele.Has_Keg_Item__c){
            kegsId.add(ele.Product__c);
        }
        return (ele.State__r && accountRec?.BillingState &&ele.State__r.Name===accountRec.BillingState);
    });
    searchableProducts(items);
    return kegsId;
};

const saveStockOutlet = async () => {
    console.log('addedProds',addedProducts)
    stockOutlet.stockVisibilityChilds = addedProducts;
    stockOutlet.isSynced = false;
    stockOutlet.Event_Id = fetchCurrentDateIdStr()+'-'+accountRec.Id;
    stockOutlet.Daily_Tracker = fetchCurrentDateIdStr();
    stockOutlet.Last_Modified = new Date();
    const position  = await getCurrentLocationHelper();
    stockOutlet.Geolocation_Latitude = position.coords.latitude;
    stockOutlet.Geolocation_Longitude = position.coords.longitude;
    await writeData('stockVisibility',stockOutlet);
    window.location.href = `stockatRisk.html?accountId=${accountRec.Id}`;
};
initializeStockVisibility();