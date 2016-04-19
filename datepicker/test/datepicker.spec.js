describe("Datepicker directive tests: ", function() {
  var mockScope
  var compileService
  
  beforeEach(angular.mock.module("datepicker"))

  beforeEach(angular.mock.inject(function($rootScope, $compile) {
    mockScope = $rootScope.$new()
    compileService = $compile
    mockScope.dateValue = new Date()
    mockScope.quickDates = [
      {date: new Date("July 13, 1961 00:00:00"), description: 'My birthday'},
      {date: new Date(0), description: 'epoch'},
      {date: new Date(), description: 'today'},
      {date: new Date("Dec 31, 2099 23:59:59"), description: 'End of the century'}
    ]
  }))

  it("Generates default datepicker elements", function(){
    var compileFn = compileService("<div my-datepicker value='dateValue'></div>")
    var elem = compileFn(mockScope)
    mockScope.$digest()
    expect(elem.children().length).toEqual(3)
    expect(elem.children().eq(1).children().length).toEqual(12)
    expect(elem.children().eq(1).find("option").eq(0).text()).toEqual('01')
    expect(elem.children().eq(1).find("option").eq(11).text()).toEqual('12')
  })

  it("Generates datepicker elements for format ddMMMMyyyy", function(){
    var compileFn = compileService("<div my-datepicker format='ddMMMMyyyy' value='dateValue'></div>")
    var elem = compileFn(mockScope)
    mockScope.$digest()
    expect(elem.text()).toEqual('JanuaryFebruaryMarchAprilMayJuneJulyAugustSeptemberOctoberNovemberDecember')
    expect(elem.children().length).toEqual(3)
    expect(elem.children().eq(1).children().length).toEqual(12)
    expect(elem.children().eq(1).find("option").eq(0).text()).toEqual('January')
    expect(elem.children().eq(1).find("option").eq(11).text()).toEqual('December')
  })

  it("Generates datepicker elements for format MM/dd/yyyy", function(){
    var compileFn = compileService("<div my-datepicker format='MM/dd/yyyy' value='dateValue'></div>")
    var elem = compileFn(mockScope)
    mockScope.$digest()
    expect(elem.text()).toEqual('010203040506070809101112//')
    expect(elem.children().length).toEqual(3)
    expect(elem.children().eq(0).children().length).toEqual(12)
    expect(elem.children().eq(0).find("option").eq(0).text()).toEqual('01')
    expect(elem.children().eq(0).find("option").eq(11).text()).toEqual('12')
  })

  it("Generates quick dates", function(){
    var compileFn = compileService("<div my-datepicker format='ddMMyyyy' quick-dates='quickDates' value='dateValue'></div>")
    var elem = compileFn(mockScope)
    mockScope.$digest()
    expect(elem.children().length).toEqual(4)
    expect(elem.children().eq(3).children().length).toEqual(5)
    expect(elem.children().eq(3).find("option").eq(0).text()).toEqual('Quick Dates')
    expect(elem.children().eq(3).find("option").eq(1).text()).toEqual('My birthday')
    expect(elem.children().eq(3).find("option").eq(2).text()).toEqual('epoch')
    expect(elem.children().eq(3).find("option").eq(3).text()).toEqual('today')
    expect(elem.children().eq(3).find("option").eq(4).text()).toEqual('End of the century')
  })
})
