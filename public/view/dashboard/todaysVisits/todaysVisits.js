let getDisable = sessionStorage.getItem('disablesection');
let cardSection = document.querySelector('.cardSectionList');
let visitProgress = document.querySelector('.visitProgress');

// if (getDisable == null || getDisable == 'true') {
//     $('.cardSectionList').addClass('disabledsection');
// } else if (getDisable == 'false') {
//     $('.cardSectionList').removeClass('disabledsection');
// }

showTodaysVisit = (todaysVisit, currentCheckIn) => {
  let VisitDate;
  console.log(todaysVisit, 'todaysVisit')
  const completedVisits = todaysVisit.filter(
    (visit) => visit.Completed__c == true
  );
  let progressPercentage = Math.round(
    (completedVisits.length / todaysVisit.length) * 100
  );
  visitProgress.innerHTML =
    '<div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style="width: ' +
    progressPercentage +
    '%;"></div></div> <span id="todayVisits"><strong>' +
    completedVisits.length +
    '/' +
    todaysVisit.length +
    '</strong> (' +
    progressPercentage +
    '%) </span>';
  for (let i of todaysVisit) {
    console.log(todaysVisit, 'todaysVisit')
   
    let temp1;
    if (i?.Recent_Activity_Date_Time__c) {
      VisitDate = new Date(i?.Recent_Activity_Date_Time__c)
        .toISOString()
        .slice(0, 10);
    }
    let tmp;
    if(i.QCO_Flag__c != undefined && i.Beacon_Flag__c != undefined && i.QCO_Flag__c != null && i.Beacon_Flag__c != null){
      if (i.QCO_Flag__c == true && i.Beacon_Flag__c == true) {
        tmp = '<img src="/media/icon12.png" alt="icon" />';
      }
      if (i.QCO_Flag__c == true && i.Beacon_Flag__c == false) {
        tmp = '<img src="/media/icon13.png" alt="icon" />';
      }
      if (i.QCO_Flag__c == false && i.Beacon_Flag__c == true) {
        tmp = '<img src="/media/icon12.png" alt="icon" />';
      }
    }
    if(i.Industry_Segment__c == 'P0'){
      temp1 = `<strong class="p0">P0</strong>`
    }else  if(i.Industry_Segment__c == 'P1'){
     temp1 = `<strong class="p1">P1</strong>`
    }else if(i.Industry_Segment__c == 'P2'){
      temp1 = `<strong class="p2">P2</strong>`
    }else  if(i.Industry_Segment__c == 'P3'){
      temp1 = `<strong class="p3">P3</strong>`
    }else  if(i.Industry_Segment__c == 'P4'){
      temp1 = `<strong class="p4">P4</strong>`
    }
    const AccId = "'" + i.Id + "'";
    const event_Id = "'" + i.eventId + "'";
    cardSection.innerHTML +=
      '<div class="card"><div class="card-body"><div class="row"> <div class="col-xs-8"><h4 id="storeName" onclick="gotoAccount(' +
      AccId +
      ')">' +
      i.Name +
      '</h4><label>' +
      i.Channel__c +
      '/ ' +
      i.Sub_Channel__c +
      '</label>' +
      '<label> <strong>Order: </strong><span>' +
      dateformat(i.Recent_Retail_Depletion__c) +
      (getLapsedDate(i.Recent_Retail_Depletion__c) <= -90 ? '(Lapsed)' : '') +
      '</span> <span>|</span>  <strong>Visit: </strong>' +
      '<span>' +
      (VisitDate ? dateformat(VisitDate) : '') +
      '</span></label><label># ' +
      i.BillingStreet +
      '</label> </div> <div class="col-xs-4 pl-0 text-right"><ul>' +
      '<li>' + temp1 + '</li> <li>' +
      (i.Draft_Status__c == true
        ? '<img src="/media/icon11.png" alt="icon" />'
        : '') +
      '</li><li> ' +
      (tmp ? tmp : '') +
      ' </li> </ul></div>' +
      '</div> <button onclick="handleCheckIn(' +
      event_Id +
      ',' +
      AccId +
      ')" class="btn btn-small">Check-In</button></div></div>';
  }
  // let tmp;
  // if (i.QCO_Flag__c == true && i.Beacon_Flag__c == true) {
  //   tmp = '<img src="/media/icon12.png" alt="icon" />';
  // }
  // if (i.QCO_Flag__c == true && i.Beacon_Flag__c == false) {
  //   tmp = '<img src="/media/icon13.png" alt="icon" />';
  // }
  // if (i.QCO_Flag__c == false && i.Beacon_Flag__c == true) {
  //   tmp = '<img src="/media/icon12.png" alt="icon" />';
  // }
  // let temp1;
  // if(i.Industry_Segment__c == 'P0'){
  //   temp1 = `<strong class="p0">P0</strong>`
  // }else  if(i.Industry_Segment__c == 'P1'){
  //  temp1 = `<strong class="p1">P1</strong>`
  // }else if(i.Industry_Segment__c == 'P2'){
  //   temp1 = `<strong class="p2">P2</strong>`
  // }else  if(i.Industry_Segment__c == 'P3'){
  //   temp1 = `<strong class="p3">P3</strong>`
  // }else  if(i.Industry_Segment__c == 'P4'){
  //   temp1 = `<strong class="p4">P4</strong>`
  // }
  //const AccId = "'" + i.Id + "'";
  // cardSection.innerHTML +=
  //   '<div class="card"><div class="card-body"><div class="row"> <div class="col-xs-8"><h4 id="storeName" onclick="gotoAccount(' +
  //   AccId +
  //   ')">' +
  //   i.Name +
  //   '</h4><label>' +
  //   i.Channel__c +
  //   '/ ' +
  //   i.Sub_Channel__c +
  //   '</label>' +
  //   '<label> <strong>Order: </strong><span>' +
  //   dateformat(i.Recent_Retail_Depletion__c) +
  //   (getLapsedDate(i.Recent_Retail_Depletion__c) <= -90 ? '(Lapsed)' : '') +
  //   '</span> <span>|</span>  <strong>Visit: </strong>' +
  //   '<span>' +
  //   (VisitDate ? dateformat(VisitDate) : '') +
  //   '</span></label><label># ' +
  //   i.BillingStreet +
  //   '</label> </div> <div class="col-xs-4 pl-0 text-right"><ul>' +
  //   '<li>' + temp1 +
  //  '</li> <li>' +
  //   (i.Draft_Status__c == true
  //     ? '<img src="/media/icon11.png" alt="icon" />'
  //     : '') +
  //   '</li><li> ' +
  //   tmp +
  //   ' </li> </ul></div>' +
  //   '</div> <button onclick="handleCheckIn()" class="btn btn-small">Check-In</button></div></div>';
};

gotoAccount = (id) => {
    window.location.href = `/view/accountLanding/accountLanding.html?accountId=${id}`
}

dateformat = (date) => {
  return moment(date).format('DD-MMM')
}

// returns diff in days
getLapsedDate = (target) => {
  var today = new Date();
  var d1 = new Date(today),
    d2 = new Date(target);
  return Math.trunc((d2.getTime() - d1.getTime()) / 1000 / 60 / 60 / 24);
};

handleCheckIn = (eventId,accountId) => {
    sessionStorage.setItem('checkinPlace','firstCheckin')
    //checkInFucn(eventId,accountId)
    window.location.href = `/view/checkIn/checkIn.html?accountId=${accountId}&eventId=${eventId}`;
}
