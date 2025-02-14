import moment from 'moment'
import MockDate from 'mockdate'
import dayjs from 'dayjs'
import utcPlugin from '../src'

dayjs.extend(utcPlugin)

const noop = function () { }

beforeEach(() => {
  MockDate.set(new Date())
})

afterEach(() => {
  MockDate.reset()
})

describe('Parse', () => {
  it('Now', () => {
    expect(dayjs().valueOf()).toBe(moment().valueOf())
  })

  it('String 20130208', () => {
    global.console.warn = noop()// moment.js '2018-4-1 1:1:1:22' will throw warn
    let d = '20130108'
    expect(dayjs(d).valueOf()).toBe(moment(d).valueOf())
    d = '2018-04-24'
    expect(dayjs(d).valueOf()).toBe(moment(d).valueOf())
    d = '2018-05-02 11:12:13'
    expect(dayjs(d).valueOf()).toBe(moment(d).valueOf())
    d = '2018-05-02 11:12:13.998'
    expect(dayjs(d).valueOf()).toBe(moment(d).valueOf())
    d = '2018-4-1'
    expect(dayjs(d).valueOf()).toBe(moment(d).valueOf()) // not recommend
    d = '2018-4-1 1:1:1:223'
    expect(dayjs(d).valueOf()).toBe(moment(d).valueOf()) // not recommend
    d = '2018-01'
    expect(dayjs(d).valueOf()).toBe(moment(d).valueOf()) // not recommend
    d = '2018'
    expect(dayjs(d).format()).toBe(moment(d).format()) // not recommend
  })

  it('String ISO 8601 date, time and zone', () => {
    let time = '2018-04-04T16:00:00.000Z'
    expect(dayjs(time).valueOf()).toBe(moment(time).valueOf())
    time = '2018-04-04T16:00:00.000+0700'
    expect(dayjs(time).valueOf()).toBe(moment(time).valueOf())
  })

  it('String Other, Null and isValid', () => {
    global.console.warn = noop()// moment.js otherString will throw warn
    expect(dayjs('otherString').toString().toLowerCase()).toBe(moment('otherString').toString().toLowerCase())
    expect(dayjs().isValid()).toBe(true)
    expect(dayjs('otherString').isValid()).toBe(false)
    expect(dayjs(null).toString().toLowerCase()).toBe(moment(null).toString().toLowerCase())
  })
})

it('Unix Timestamp Number (milliseconds) 1523520536000', () => {
  const timestamp = 1523520536000
  expect(dayjs(timestamp).valueOf()).toBe(moment(timestamp).valueOf())
})

it('String and Number 20180101', () => {
  expect(dayjs(20180101).valueOf()).toBe(moment(20180101).valueOf())
  expect(dayjs('20180101').valueOf()).toBe(moment('20180101').valueOf())
})

it('Number 0', () => {
  expect(dayjs(0).valueOf()).toBe(moment(0).valueOf())
})

it('Clone not affect each other', () => {
  const base = dayjs(20170101)
  const year = base.year()
  const another = base.set('year', year + 1)
  expect(another.unix() - base.unix()).toBe(31536000)
})

it('Clone with same value', () => {
  const base = dayjs()
  const year = base.year()
  const newBase = base.set('year', year + 1)
  const another = newBase.clone()
  expect(newBase.toString()).toBe(another.toString())
})

it('new instance is not local', () => {
  let timeStr = '2018-05-18T03:04:05+08:00'
  if (new Date().getTimezoneOffset() === -480) timeStr = '2018-05-18T03:04:05+07:00'
  expect(dayjs(timeStr).isLocal()).toBe(false)
})

it('new instance startOf function keeps given timezone', () => {
  let timeStr = '2018-05-18T03:04:05+08:00'
  if (new Date().getTimezoneOffset() === -480) timeStr = '2018-05-18T03:04:05+07:00'
  expect(dayjs(timeStr).startOf('day').isLocal()).toBe(false);
})
