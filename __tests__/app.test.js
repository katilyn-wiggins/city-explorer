require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');
const {
  formatLocation,
  formatWeather,
  formatReviews
} = require('../lib/mungeUtils.js');

describe('app routes', () => {
  describe('routes', () => {
    let token;

    beforeAll(async (done) => {
      execSync('npm run setup-db');

      client.connect();

      const signInData = await fakeRequest(app).post('/auth/signup').send({
        email: 'jon@user.com',
        password: '1234'
      });

      token = signInData.body.token; // eslint-disable-line

      return done();
    });

    afterAll((done) => {
      return client.end(done);
    });

    //location route
    test('returns a location name and lat/long when given a city', async () => {
      const expectation = {
        formatted_query: 'Saxapahaw, Alamance County, North Carolina, USA',
        latitude: '35.947868',
        longitude: '-79.3207362709935'
      };

      const data = await fakeRequest(app)
        .get('/location?search=saxapahaw')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    //location munge util test
    test('returns a formatted location when given a lot of location information', async () => {
      const data = [
        {
          place_id: '230882811',
          licence: 'https://locationiq.com/attribution',
          osm_type: 'relation',
          osm_id: '178946',
          boundingbox: ['35.915326', '35.980409', '-79.342231', '-79.298548'],
          lat: '35.947868',
          lon: '-79.3207362709935',
          display_name: 'Saxapahaw, Alamance County, North Carolina, USA',
          class: 'boundary',
          type: 'administrative',
          importance: 0.404123468139824,
          icon:
            'https://locationiq.org/static/images/mapicons/poi_boundary_administrative.p.20.png'
        },
        {
          place_id: '488601',
          licence: 'https://locationiq.com/attribution',
          osm_type: 'node',
          osm_id: '158577423',
          boundingbox: [
            '35.9273227',
            '35.9673227',
            '-79.3416023',
            '-79.3016023'
          ],
          lat: '35.9473227',
          lon: '-79.3216023',
          display_name:
            'Saxapahaw, Saxapahaw, Alamance County, North Carolina, 27253, USA',
          class: 'place',
          type: 'hamlet',
          importance: 0.35,
          icon:
            'https://locationiq.org/static/images/mapicons/poi_place_village.p.20.png'
        }
      ];

      const expectation = {
        formatted_query: 'Saxapahaw, Alamance County, North Carolina, USA',
        latitude: '35.947868',
        longitude: '-79.3207362709935'
      };

      const mungedLocation = formatLocation(data);

      expect(mungedLocation).toEqual(expectation);
    });

    //weather route
    test('returns weather information when given lat and long', async () => {
      const expectation = {
        formatted_query: 'Saxapahaw, Alamance County, North Carolina, USA',
        latitude: '35.947868',
        longitude: '-79.3207362709935'
      };

      const data = await fakeRequest(app)
        .get('/location?search=saxapahaw')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    // weather munge util test
    test('returns formatted weather information when given an unformattted array of weather data', async () => {
      const weatherObject = {
        data: [
          {
            moonrise_ts: 1614639970,
            wind_cdir: 'WNW',
            rh: 96,
            pres: 761.062,
            high_temp: -28.4,
            sunset_ts: 1614626629,
            ozone: 385.5,
            moon_phase: 0.874122,
            wind_gust_spd: 12.3984,
            snow_depth: 1000,
            clouds: 100,
            ts: 1614567660,
            sunrise_ts: 1614590758,
            app_min_temp: -41.3,
            wind_spd: 6.29481,
            pop: 45,
            wind_cdir_full: 'west-northwest',
            slp: 1019.94,
            moon_phase_lunation: 0.61,
            valid_date: '2021-03-01',
            app_max_temp: -39.6,
            vis: 1.14422,
            dewpt: -31.6,
            snow: 3,
            uv: 0,
            weather: {
              icon: 's01d',
              code: 600,
              description: 'Light snow'
            },
            wind_dir: 289,
            max_dhi: null,
            clouds_hi: 100,
            precip: 0.25,
            low_temp: -32.4,
            max_temp: -27.8,
            moonset_ts: 1614593209,
            datetime: '2021-03-01',
            temp: -28.3,
            min_temp: -29.1,
            clouds_mid: 96,
            clouds_low: 86
          },
          {
            moonrise_ts: 1614726370,
            wind_cdir: 'W',
            rh: 80,
            pres: 770.875,
            high_temp: -26.1,
            sunset_ts: 1614713249,
            ozone: 395.396,
            moon_phase: 0.788022,
            wind_gust_spd: 16.2031,
            snow_depth: 1003.8,
            clouds: 60,
            ts: 1614654060,
            sunrise_ts: 1614676914,
            app_min_temp: -52.3,
            wind_spd: 9.25242,
            pop: 55,
            wind_cdir_full: 'west',
            slp: 1042.25,
            moon_phase_lunation: 0.65,
            valid_date: '2021-03-02',
            app_max_temp: -41,
            vis: 15.4737,
            dewpt: -40.5,
            snow: 3.75,
            uv: 0,
            weather: {
              icon: 's01d',
              code: 600,
              description: 'Light snow'
            },
            wind_dir: 272,
            max_dhi: null,
            clouds_hi: 60,
            precip: 0.375,
            low_temp: -37.9,
            max_temp: -27.9,
            moonset_ts: 1614678877,
            datetime: '2021-03-02',
            temp: -34.8,
            min_temp: -38,
            clouds_mid: 45,
            clouds_low: 40
          },
          {
            moonrise_ts: 1614819950,
            wind_cdir: 'WSW',
            rh: 77,
            pres: 774.75,
            high_temp: -17.4,
            sunset_ts: 1614799868,
            ozone: 374.469,
            moon_phase: 0.687289,
            wind_gust_spd: 14.8984,
            snow_depth: 1003.8,
            clouds: 58,
            ts: 1614740460,
            sunrise_ts: 1614763070,
            app_min_temp: -46.4,
            wind_spd: 7.65592,
            pop: 0,
            wind_cdir_full: 'west-southwest',
            slp: 1033.83,
            moon_phase_lunation: 0.68,
            valid_date: '2021-03-03',
            app_max_temp: -30,
            vis: 24.128,
            dewpt: -30.6,
            snow: 0,
            uv: 0,
            weather: {
              icon: 'c03d',
              code: 803,
              description: 'Broken clouds'
            },
            wind_dir: 250,
            max_dhi: null,
            clouds_hi: 58,
            precip: 0,
            low_temp: -26.3,
            max_temp: -19.8,
            moonset_ts: 1614764348,
            datetime: '2021-03-03',
            temp: -25,
            min_temp: -36,
            clouds_mid: 6,
            clouds_low: 0
          },
          {
            moonrise_ts: 1614827524,
            wind_cdir: 'WSW',
            rh: 77,
            pres: 770.583,
            high_temp: -17.6,
            sunset_ts: 1614886486,
            ozone: 408.917,
            moon_phase: 0.578706,
            wind_gust_spd: 15.4062,
            snow_depth: 1003.8,
            clouds: 93,
            ts: 1614826860,
            sunrise_ts: 1614849226,
            app_min_temp: -35.6,
            wind_spd: 8.06096,
            pop: 0,
            wind_cdir_full: 'west-southwest',
            slp: 1023.06,
            moon_phase_lunation: 0.72,
            valid_date: '2021-03-04',
            app_max_temp: -26.6,
            vis: 24.128,
            dewpt: -24.8,
            snow: 0,
            uv: 0.406984,
            weather: {
              icon: 'c04d',
              code: 804,
              description: 'Overcast clouds'
            },
            wind_dir: 238,
            max_dhi: null,
            clouds_hi: 92,
            precip: 0,
            low_temp: -26.3,
            max_temp: -17.3,
            moonset_ts: 1614849168,
            datetime: '2021-03-04',
            temp: -19.8,
            min_temp: -25.2,
            clouds_mid: 42,
            clouds_low: 0
          },
          {
            moonrise_ts: 1614922435,
            wind_cdir: 'W',
            rh: 79,
            pres: 765.25,
            high_temp: -27.4,
            sunset_ts: 1614973104,
            ozone: 426.75,
            moon_phase: 0.469146,
            wind_gust_spd: 11.2031,
            snow_depth: 1003.8,
            clouds: 16,
            ts: 1614913260,
            sunrise_ts: 1614935382,
            app_min_temp: -50.3,
            wind_spd: 6.75473,
            pop: 0,
            wind_cdir_full: 'west',
            slp: 1026.62,
            moon_phase_lunation: null,
            valid_date: '2021-03-05',
            app_max_temp: -34.9,
            vis: 24.128,
            dewpt: -35.9,
            snow: 0,
            uv: 0.799576,
            weather: {
              icon: 'c02d',
              code: 801,
              description: 'Few clouds'
            },
            wind_dir: 266,
            max_dhi: null,
            clouds_hi: 1,
            precip: 0,
            low_temp: -40.3,
            max_temp: -23.2,
            moonset_ts: null,
            datetime: '2021-03-05',
            temp: -30.3,
            min_temp: -36.6,
            clouds_mid: 14,
            clouds_low: 0
          },
          {
            moonrise_ts: null,
            wind_cdir: 'SW',
            rh: 87,
            pres: 762.056,
            high_temp: -14.4,
            sunset_ts: 1615059720,
            ozone: 411.333,
            moon_phase: 0.469146,
            wind_gust_spd: 13.2031,
            snow_depth: 1003.8,
            clouds: 30,
            ts: 1614999660,
            sunrise_ts: 1615021538,
            app_min_temp: -55.3,
            wind_spd: 3.8859,
            pop: 20,
            wind_cdir_full: 'southwest',
            slp: 1023.47,
            moon_phase_lunation: null,
            valid_date: '2021-03-06',
            app_max_temp: -23,
            vis: 22.928,
            dewpt: -36.8,
            snow: 0,
            uv: 0.80632,
            weather: {
              icon: 'c02d',
              code: 802,
              description: 'Scattered clouds'
            },
            wind_dir: 228,
            max_dhi: null,
            clouds_hi: 28,
            precip: 0.0625,
            low_temp: -38.4,
            max_temp: -13.8,
            moonset_ts: null,
            datetime: '2021-03-06',
            temp: -32.1,
            min_temp: -40.3,
            clouds_mid: 9,
            clouds_low: 0
          },
          {
            moonrise_ts: null,
            wind_cdir: 'WSW',
            rh: 80,
            pres: 757.062,
            high_temp: -28.3,
            sunset_ts: 1615146337,
            ozone: 433.969,
            moon_phase: 0.355178,
            wind_gust_spd: 14.7188,
            snow_depth: 1003.8,
            clouds: 77,
            ts: 1615086060,
            sunrise_ts: 1615107693,
            app_min_temp: -41,
            wind_spd: 7.79958,
            pop: 10,
            wind_cdir_full: 'west-southwest',
            slp: 1010.06,
            moon_phase_lunation: null,
            valid_date: '2021-03-07',
            app_max_temp: -25.8,
            vis: 21.2951,
            dewpt: -27.1,
            snow: 0,
            uv: 0.592248,
            weather: {
              icon: 'c04d',
              code: 804,
              description: 'Overcast clouds'
            },
            wind_dir: 242,
            max_dhi: null,
            clouds_hi: 68,
            precip: 0.125,
            low_temp: -29.4,
            max_temp: -14.5,
            moonset_ts: null,
            datetime: '2021-03-07',
            temp: -22.3,
            min_temp: -29.1,
            clouds_mid: 71,
            clouds_low: 2
          },
          {
            moonrise_ts: null,
            wind_cdir: 'WSW',
            rh: 83,
            pres: 753.688,
            high_temp: -27.3,
            sunset_ts: 1615232952,
            ozone: 434.656,
            moon_phase: 0.250906,
            wind_gust_spd: 8.29688,
            snow_depth: 1003.8,
            clouds: 2,
            ts: 1615172460,
            sunrise_ts: 1615193849,
            app_min_temp: -41.7,
            wind_spd: 6.10779,
            pop: 0,
            wind_cdir_full: 'west-southwest',
            slp: 1011.06,
            moon_phase_lunation: null,
            valid_date: '2021-03-08',
            app_max_temp: -40.3,
            vis: 24.128,
            dewpt: -34,
            snow: 0,
            uv: 1.26396,
            weather: {
              icon: 'c02d',
              code: 801,
              description: 'Few clouds'
            },
            wind_dir: 244,
            max_dhi: null,
            clouds_hi: 2,
            precip: 0,
            low_temp: -36.3,
            max_temp: -28.3,
            moonset_ts: null,
            datetime: '2021-03-08',
            temp: -29,
            min_temp: -29.7,
            clouds_mid: 0,
            clouds_low: 0
          },
          {
            moonrise_ts: null,
            wind_cdir: 'W',
            rh: 86,
            pres: 749.125,
            high_temp: -39.1,
            sunset_ts: 1615319567,
            ozone: 439.812,
            moon_phase: 0.161232,
            wind_gust_spd: 7.41406,
            snow_depth: 1003.8,
            clouds: 46,
            ts: 1615258860,
            sunrise_ts: 1615280004,
            app_min_temp: -53.8,
            wind_spd: 5.42427,
            pop: 0,
            wind_cdir_full: 'west',
            slp: 1009,
            moon_phase_lunation: null,
            valid_date: '2021-03-09',
            app_max_temp: -39.1,
            vis: 20.74,
            dewpt: -36.4,
            snow: 0,
            uv: 0.816277,
            weather: {
              icon: 'c03d',
              code: 803,
              description: 'Broken clouds'
            },
            wind_dir: 260,
            max_dhi: null,
            clouds_hi: 31,
            precip: 0,
            low_temp: -44.2,
            max_temp: -27.3,
            moonset_ts: null,
            datetime: '2021-03-09',
            temp: -31.6,
            min_temp: -41.6,
            clouds_mid: 37,
            clouds_low: 1
          },
          {
            moonrise_ts: 1615372310,
            wind_cdir: 'W',
            rh: 78,
            pres: 748.875,
            high_temp: -35.6,
            sunset_ts: 1615406182,
            ozone: 440.406,
            moon_phase: 0.0337041,
            wind_gust_spd: 7.19922,
            snow_depth: 1003.8,
            clouds: 3,
            ts: 1615345260,
            sunrise_ts: 1615366160,
            app_min_temp: -60.2,
            wind_spd: 5.17301,
            pop: 0,
            wind_cdir_full: 'west',
            slp: 1020.25,
            moon_phase_lunation: 0.92,
            valid_date: '2021-03-10',
            app_max_temp: -56.9,
            vis: 24.128,
            dewpt: -49.9,
            snow: 0,
            uv: 1.25327,
            weather: {
              icon: 'c02d',
              code: 801,
              description: 'Few clouds'
            },
            wind_dir: 279,
            max_dhi: null,
            clouds_hi: 3,
            precip: 0,
            low_temp: -43.3,
            max_temp: -39.2,
            moonset_ts: 1615393117,
            datetime: '2021-03-10',
            temp: -43.4,
            min_temp: -44.3,
            clouds_mid: 0,
            clouds_low: 0
          },
          {
            moonrise_ts: 1615457213,
            wind_cdir: 'W',
            rh: 84,
            pres: 747.333,
            high_temp: -36.8,
            sunset_ts: 1615492796,
            ozone: 435.542,
            moon_phase: 0.00665566,
            wind_gust_spd: 4.5,
            snow_depth: 1003.8,
            clouds: 93,
            ts: 1615431660,
            sunrise_ts: 1615452315,
            app_min_temp: -57.6,
            wind_spd: 3.25202,
            pop: 0,
            wind_cdir_full: 'west',
            slp: 1012.25,
            moon_phase_lunation: 0.95,
            valid_date: '2021-03-11',
            app_max_temp: -49.4,
            vis: 20.9393,
            dewpt: -44.3,
            snow: 0,
            uv: 0.419211,
            weather: {
              icon: 'c04d',
              code: 804,
              description: 'Overcast clouds'
            },
            wind_dir: 281,
            max_dhi: null,
            clouds_hi: 82,
            precip: 0,
            low_temp: -48.2,
            max_temp: -35.5,
            moonset_ts: 1615486176,
            datetime: '2021-03-11',
            temp: -38.7,
            min_temp: -43.3,
            clouds_mid: 74,
            clouds_low: 0
          },
          {
            moonrise_ts: 1615542715,
            wind_cdir: 'W',
            rh: 82,
            pres: 742,
            high_temp: -25,
            sunset_ts: 1615579410,
            ozone: 445.375,
            moon_phase: 0.0033022,
            wind_gust_spd: 5.52734,
            snow_depth: 1003.8,
            clouds: 62,
            ts: 1615518060,
            sunrise_ts: 1615538470,
            app_min_temp: -55.8,
            wind_spd: 4.10814,
            pop: 0,
            wind_cdir_full: 'west',
            slp: 1009.5,
            moon_phase_lunation: 0.99,
            valid_date: '2021-03-12',
            app_max_temp: -54.6,
            vis: 24.128,
            dewpt: -45.9,
            snow: 0,
            uv: 0.515978,
            weather: {
              icon: 'c03d',
              code: 803,
              description: 'Broken clouds'
            },
            wind_dir: 260,
            max_dhi: null,
            clouds_hi: 19,
            precip: 0,
            low_temp: -27.1,
            max_temp: -39.5,
            moonset_ts: 1615578715,
            datetime: '2021-03-12',
            temp: -40.2,
            min_temp: -48.2,
            clouds_mid: 45,
            clouds_low: 0
          },
          {
            moonrise_ts: 1615628411,
            wind_cdir: 'W',
            rh: 86,
            pres: 740.25,
            high_temp: -23,
            sunset_ts: 1615666023,
            ozone: 445.75,
            moon_phase: 0.0223656,
            wind_gust_spd: 12.7031,
            snow_depth: 1003.8,
            clouds: 17,
            ts: 1615604460,
            sunrise_ts: 1615624625,
            app_min_temp: -65.2,
            wind_spd: 7.96895,
            pop: 0,
            wind_cdir_full: 'west',
            slp: 1013.5,
            moon_phase_lunation: 0.02,
            valid_date: '2021-03-13',
            app_max_temp: -61,
            vis: 18.48,
            dewpt: -54.1,
            snow: 0,
            uv: 0.954947,
            weather: {
              icon: 'c02d',
              code: 801,
              description: 'Few clouds'
            },
            wind_dir: 260,
            max_dhi: null,
            clouds_hi: 0,
            precip: 0,
            low_temp: -25,
            max_temp: -41.8,
            moonset_ts: 1615670977,
            datetime: '2021-03-13',
            temp: -46.5,
            min_temp: -48.2,
            clouds_mid: 17,
            clouds_low: 0
          },
          {
            moonrise_ts: 1615714185,
            wind_cdir: 'W',
            rh: 83,
            pres: 747,
            high_temp: -26.2,
            sunset_ts: 1615752636,
            ozone: 445,
            moon_phase: 0.0618458,
            wind_gust_spd: 19.4062,
            snow_depth: 1003.8,
            clouds: 38,
            ts: 1615690860,
            sunrise_ts: 1615710780,
            app_min_temp: -57.2,
            wind_spd: 9.93355,
            pop: 0,
            wind_cdir_full: 'west',
            slp: 1018,
            moon_phase_lunation: 0.05,
            valid_date: '2021-03-14',
            app_max_temp: -55.6,
            vis: 20.592,
            dewpt: -46.9,
            snow: 0,
            uv: 1.26547,
            weather: {
              icon: 'c02d',
              code: 802,
              description: 'Scattered clouds'
            },
            wind_dir: 268,
            max_dhi: null,
            clouds_hi: 0,
            precip: 0,
            low_temp: -40.3,
            max_temp: -35.4,
            moonset_ts: 1615763149,
            datetime: '2021-03-14',
            temp: -41.2,
            min_temp: -41.8,
            clouds_mid: 38,
            clouds_low: 2
          },
          {
            moonrise_ts: 1615799983,
            wind_cdir: 'SW',
            rh: 75,
            pres: 747.75,
            high_temp: -23.8,
            sunset_ts: 1615839249,
            ozone: 417.875,
            moon_phase: 0.119259,
            wind_gust_spd: 6.51562,
            snow_depth: 1003.8,
            clouds: 80,
            ts: 1615777260,
            sunrise_ts: 1615796935,
            app_min_temp: -50.9,
            wind_spd: 4.40333,
            pop: 0,
            wind_cdir_full: 'southwest',
            slp: 1005,
            moon_phase_lunation: 0.09,
            valid_date: '2021-03-15',
            app_max_temp: -38.9,
            vis: 24.128,
            dewpt: -38.1,
            snow: 0,
            uv: 0.612023,
            weather: {
              icon: 'c04d',
              code: 804,
              description: 'Overcast clouds'
            },
            wind_dir: 233,
            max_dhi: null,
            clouds_hi: 70,
            precip: 0,
            low_temp: -29.4,
            max_temp: -23.8,
            moonset_ts: 1615855412,
            datetime: '2021-03-15',
            temp: -32,
            min_temp: -36.8,
            clouds_mid: 36,
            clouds_low: 0
          },
          {
            moonrise_ts: 1615885763,
            wind_cdir: 'WSW',
            rh: 78,
            pres: 743.5,
            high_temp: -22.4,
            sunset_ts: 1615925861,
            ozone: 403.375,
            moon_phase: 0.119259,
            wind_gust_spd: 6.63672,
            snow_depth: 1003.8,
            clouds: 81,
            ts: 1615863660,
            sunrise_ts: 1615883089,
            app_min_temp: -36.2,
            wind_spd: 5.45005,
            pop: 0,
            wind_cdir_full: 'west-southwest',
            slp: 991.75,
            moon_phase_lunation: 0.12,
            valid_date: '2021-03-16',
            app_max_temp: -36.2,
            vis: 24.128,
            dewpt: -30.4,
            snow: 0,
            uv: 0.735619,
            weather: {
              icon: 'c04d',
              code: 804,
              description: 'Overcast clouds'
            },
            wind_dir: 240,
            max_dhi: null,
            clouds_hi: 81,
            precip: 0,
            low_temp: -25.9,
            max_temp: -22.4,
            moonset_ts: 1615941812,
            datetime: '2021-03-16',
            temp: -25,
            min_temp: -25.9,
            clouds_mid: 8,
            clouds_low: 0
          }
        ],
        city_name: 'Tasiilaq',
        lon: -32,
        timezone: 'America/Godthab',
        lat: 77,
        country_code: 'GL',
        state_code: '07'
      };

      const expectation = [
        {
          forecast: 'Light snow',
          time: 'Mon Mar 01 2021'
        },
        {
          forecast: 'Light snow',
          time: 'Tue Mar 02 2021'
        },
        {
          forecast: 'Broken clouds',
          time: 'Wed Mar 03 2021'
        },
        {
          forecast: 'Overcast clouds',
          time: 'Thu Mar 04 2021'
        },
        {
          forecast: 'Few clouds',
          time: 'Fri Mar 05 2021'
        },
        {
          forecast: 'Scattered clouds',
          time: 'Sat Mar 06 2021'
        },
        {
          forecast: 'Overcast clouds',
          time: 'Sun Mar 07 2021'
        }
      ];

      const finalWeather = formatWeather(weatherObject);

      expect(finalWeather).toEqual(expectation);
    });

    // weather munge util test
    test('returns formatted reviews information when given an unformattted array of weather data', async () => {
      const reviewObject = {
        businesses: [
          {
            id: 'wGl_DyNxSv8KUtYgiuLhmA',
            alias: 'bi-rite-creamery-san-francisco',
            name: 'Bi-Rite Creamery',
            image_url:
              'https://s3-media2.fl.yelpcdn.com/bphoto/iPNJKlOQ7-eyqa4Yv2r2BA/o.jpg',
            is_closed: false,
            url:
              'https://www.yelp.com/biz/bi-rite-creamery-san-francisco?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ',
            review_count: 9653,
            categories: [
              {
                alias: 'icecream',
                title: 'Ice Cream & Frozen Yogurt'
              }
            ],
            rating: 4.5,
            coordinates: {
              latitude: 37.761591,
              longitude: -122.425717
            },
            transactions: ['delivery'],
            price: '$',
            location: {
              address1: '3692 18th St',
              address2: null,
              address3: '',
              city: 'San Francisco',
              zip_code: '94110',
              country: 'US',
              state: 'CA',
              display_address: ['3692 18th St', 'San Francisco, CA 94110']
            },
            phone: '+14156265600',
            display_phone: '(415) 626-5600',
            distance: 2.2367390261918618e-9
          },
          {
            id: 'ri7UUYmx21AgSpRsf4-9QA',
            alias: 'tartine-bakery-and-cafe-san-francisco',
            name: 'Tartine Bakery & Cafe',
            image_url:
              'https://s3-media2.fl.yelpcdn.com/bphoto/nPUUXYVVa3CHJh5yzH8Xnw/o.jpg',
            is_closed: false,
            url:
              'https://www.yelp.com/biz/tartine-bakery-and-cafe-san-francisco?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ',
            review_count: 8036,
            categories: [
              {
                alias: 'bakeries',
                title: 'Bakeries'
              },
              {
                alias: 'cafes',
                title: 'Cafes'
              },
              {
                alias: 'desserts',
                title: 'Desserts'
              }
            ],
            rating: 4.0,
            coordinates: {
              latitude: 37.76131,
              longitude: -122.42431
            },
            transactions: ['delivery'],
            price: '$$',
            location: {
              address1: '600 Guerrero St',
              address2: '',
              address3: '',
              city: 'San Francisco',
              zip_code: '94110',
              country: 'US',
              state: 'CA',
              display_address: ['600 Guerrero St', 'San Francisco, CA 94110']
            },
            phone: '+14154872600',
            display_phone: '(415) 487-2600',
            distance: 143.7539691377374
          },
          {
            id: 'Tf_27JvnneEx0Tz79UwShg',
            alias: 'mission-dolores-park-san-francisco',
            name: 'Mission Dolores Park',
            image_url:
              'https://s3-media1.fl.yelpcdn.com/bphoto/MDabhC69akFE2o21s7gtEg/o.jpg',
            is_closed: false,
            url:
              'https://www.yelp.com/biz/mission-dolores-park-san-francisco?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ',
            review_count: 1480,
            categories: [
              {
                alias: 'parks',
                title: 'Parks'
              },
              {
                alias: 'playgrounds',
                title: 'Playgrounds'
              },
              {
                alias: 'basketballcourts',
                title: 'Basketball Courts'
              }
            ],
            rating: 4.5,
            coordinates: {
              latitude: 37.759764,
              longitude: -122.427052
            },
            transactions: [],
            location: {
              address1: '19th & Dolores St',
              address2: '',
              address3: '',
              city: 'San Francisco',
              zip_code: '94114',
              country: 'US',
              state: 'CA',
              display_address: ['19th & Dolores St', 'San Francisco, CA 94114']
            },
            phone: '+14158312700',
            display_phone: '(415) 831-2700',
            distance: 234.61409665112538
          },
          {
            id: 'SGRmnarrNuVEsAjYdEoA0w',
            alias: 'el-farolito-san-francisco-2',
            name: 'El Farolito',
            image_url:
              'https://s3-media1.fl.yelpcdn.com/bphoto/gcC2Uwtu5raP13D3jWYm0Q/o.jpg',
            is_closed: false,
            url:
              'https://www.yelp.com/biz/el-farolito-san-francisco-2?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ',
            review_count: 4991,
            categories: [
              {
                alias: 'mexican',
                title: 'Mexican'
              }
            ],
            rating: 4.0,
            coordinates: {
              latitude: 37.75265,
              longitude: -122.41812
            },
            transactions: ['delivery'],
            price: '$',
            location: {
              address1: '2779 Mission St',
              address2: '',
              address3: '',
              city: 'San Francisco',
              zip_code: '94110',
              country: 'US',
              state: 'CA',
              display_address: ['2779 Mission St', 'San Francisco, CA 94110']
            },
            phone: '+14158247877',
            display_phone: '(415) 824-7877',
            distance: 1192.3106847316956
          },
          {
            id: 'n6L5VIGunR51-D55C-eYeQ',
            alias: 'foreign-cinema-san-francisco',
            name: 'Foreign Cinema',
            image_url:
              'https://s3-media3.fl.yelpcdn.com/bphoto/cw5y2LSOIE-EVNjKK_d7SQ/o.jpg',
            is_closed: false,
            url:
              'https://www.yelp.com/biz/foreign-cinema-san-francisco?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ',
            review_count: 4898,
            categories: [
              {
                alias: 'breakfast_brunch',
                title: 'Breakfast & Brunch'
              },
              {
                alias: 'mediterranean',
                title: 'Mediterranean'
              },
              {
                alias: 'cocktailbars',
                title: 'Cocktail Bars'
              }
            ],
            rating: 4.0,
            coordinates: {
              latitude: 37.75637,
              longitude: -122.41925
            },
            transactions: ['delivery'],
            price: '$$$',
            location: {
              address1: '2534 Mission St',
              address2: '',
              address3: '',
              city: 'San Francisco',
              zip_code: '94110',
              country: 'US',
              state: 'CA',
              display_address: ['2534 Mission St', 'San Francisco, CA 94110']
            },
            phone: '+14156487600',
            display_phone: '(415) 648-7600',
            distance: 813.3239953572661
          },
          {
            id: 'XQLmEdXoMzOpffwoFaBtaQ',
            alias: 'kitchen-story-san-francisco',
            name: 'Kitchen Story',
            image_url:
              'https://s3-media3.fl.yelpcdn.com/bphoto/XIhdtd0fB2P_v_qhh1hWbg/o.jpg',
            is_closed: false,
            url:
              'https://www.yelp.com/biz/kitchen-story-san-francisco?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ',
            review_count: 3453,
            categories: [
              {
                alias: 'breakfast_brunch',
                title: 'Breakfast & Brunch'
              },
              {
                alias: 'asianfusion',
                title: 'Asian Fusion'
              },
              {
                alias: 'newamerican',
                title: 'American (New)'
              }
            ],
            rating: 4.0,
            coordinates: {
              latitude: 37.7642352,
              longitude: -122.4306936
            },
            transactions: ['restaurant_reservation', 'delivery', 'pickup'],
            price: '$$',
            location: {
              address1: '3499 16th St',
              address2: '',
              address3: '',
              city: 'San Francisco',
              zip_code: '94114',
              country: 'US',
              state: 'CA',
              display_address: ['3499 16th St', 'San Francisco, CA 94114']
            },
            phone: '+14155254905',
            display_phone: '(415) 525-4905',
            distance: 522.3061118400777
          },
          {
            id: 'ofFgj0sd8iDQunY00hhDVQ',
            alias: 'garden-creamery-san-francisco-2',
            name: 'Garden Creamery',
            image_url:
              'https://s3-media2.fl.yelpcdn.com/bphoto/VUfUgl5k7kAfmzjeb95_UA/o.jpg',
            is_closed: false,
            url:
              'https://www.yelp.com/biz/garden-creamery-san-francisco-2?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ',
            review_count: 1000,
            categories: [
              {
                alias: 'icecream',
                title: 'Ice Cream & Frozen Yogurt'
              },
              {
                alias: 'foodtrucks',
                title: 'Food Trucks'
              }
            ],
            rating: 4.5,
            coordinates: {
              latitude: 37.75869,
              longitude: -122.420435
            },
            transactions: ['delivery'],
            price: '$',
            location: {
              address1: '3566 20th St',
              address2: '',
              address3: '',
              city: 'San Francisco',
              zip_code: '94110',
              country: 'US',
              state: 'CA',
              display_address: ['3566 20th St', 'San Francisco, CA 94110']
            },
            phone: '+18082246626',
            display_phone: '(808) 224-6626',
            distance: 565.3851049966022
          },
          {
            id: 'bai6umLcCNy9cXql0Js2RQ',
            alias: 'pizzeria-delfina-mission-san-francisco',
            name: 'Pizzeria Delfina - Mission',
            image_url:
              'https://s3-media3.fl.yelpcdn.com/bphoto/mXfuUNiaoGaeg7ra4IgcJQ/o.jpg',
            is_closed: false,
            url:
              'https://www.yelp.com/biz/pizzeria-delfina-mission-san-francisco?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ',
            review_count: 2294,
            categories: [
              {
                alias: 'pizza',
                title: 'Pizza'
              },
              {
                alias: 'italian',
                title: 'Italian'
              },
              {
                alias: 'bars',
                title: 'Bars'
              }
            ],
            rating: 4.0,
            coordinates: {
              latitude: 37.7614143,
              longitude: -122.4242316
            },
            transactions: ['delivery', 'pickup'],
            price: '$$',
            location: {
              address1: '3611 18th St',
              address2: null,
              address3: '',
              city: 'San Francisco',
              zip_code: '94110',
              country: 'US',
              state: 'CA',
              display_address: ['3611 18th St', 'San Francisco, CA 94110']
            },
            phone: '+14154376800',
            display_phone: '(415) 437-6800',
            distance: 132.04688231187092
          },
          {
            id: 'CYttYTEiQuhSfo3SEh79fA',
            alias: 'shizen-vegan-sushi-bar-and-izakaya-san-francisco',
            name: 'Shizen Vegan Sushi Bar & Izakaya',
            image_url:
              'https://s3-media4.fl.yelpcdn.com/bphoto/-1BWnyjrsDmTmXH_3wZl_w/o.jpg',
            is_closed: false,
            url:
              'https://www.yelp.com/biz/shizen-vegan-sushi-bar-and-izakaya-san-francisco?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ',
            review_count: 1684,
            categories: [
              {
                alias: 'sushi',
                title: 'Sushi Bars'
              },
              {
                alias: 'vegan',
                title: 'Vegan'
              },
              {
                alias: 'izakaya',
                title: 'Izakaya'
              }
            ],
            rating: 4.5,
            coordinates: {
              latitude: 37.768326,
              longitude: -122.421682
            },
            transactions: [],
            price: '$$',
            location: {
              address1: '370 14th St',
              address2: '',
              address3: '',
              city: 'San Francisco',
              zip_code: '94103',
              country: 'US',
              state: 'CA',
              display_address: ['370 14th St', 'San Francisco, CA 94103']
            },
            phone: '+14156785767',
            display_phone: '(415) 678-5767',
            distance: 828.6435535849994
          },
          {
            id: '1hMD7RQogPDWpE-p3LKjXA',
            alias: 'loló-san-francisco-4',
            name: 'Loló',
            image_url:
              'https://s3-media4.fl.yelpcdn.com/bphoto/9fPMGo5daNzQ41ckzW4CZg/o.jpg',
            is_closed: false,
            url:
              'https://www.yelp.com/biz/lol%C3%B3-san-francisco-4?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ',
            review_count: 2216,
            categories: [
              {
                alias: 'mexican',
                title: 'Mexican'
              },
              {
                alias: 'tapasmallplates',
                title: 'Tapas/Small Plates'
              }
            ],
            rating: 4.0,
            coordinates: {
              latitude: 37.7573462,
              longitude: -122.4214034
            },
            transactions: ['delivery'],
            price: '$$',
            location: {
              address1: '974 Valencia St',
              address2: '',
              address3: '',
              city: 'San Francisco',
              zip_code: '94110',
              country: 'US',
              state: 'CA',
              display_address: ['974 Valencia St', 'San Francisco, CA 94110']
            },
            phone: '+14156435656',
            display_phone: '(415) 643-5656',
            distance: 605.4590312502615
          },
          {
            id: '4KfQnlcSu4bbTqnvGdGptw',
            alias: 'beretta-san-francisco',
            name: 'Beretta',
            image_url:
              'https://s3-media1.fl.yelpcdn.com/bphoto/OnjVYibgMoQRyRNuqZGCIA/o.jpg',
            is_closed: false,
            url:
              'https://www.yelp.com/biz/beretta-san-francisco?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ',
            review_count: 3680,
            categories: [
              {
                alias: 'italian',
                title: 'Italian'
              },
              {
                alias: 'pizza',
                title: 'Pizza'
              },
              {
                alias: 'breakfast_brunch',
                title: 'Breakfast & Brunch'
              }
            ],
            rating: 4.0,
            coordinates: {
              latitude: 37.753869,
              longitude: -122.420611
            },
            transactions: ['delivery'],
            price: '$$',
            location: {
              address1: '1199 Valencia St',
              address2: '',
              address3: '',
              city: 'San Francisco',
              zip_code: '94110',
              country: 'US',
              state: 'CA',
              display_address: ['1199 Valencia St', 'San Francisco, CA 94110']
            },
            phone: '+14156951199',
            display_phone: '(415) 695-1199',
            distance: 967.953538075765
          },
          {
            id: 'JARsJVKLPgs_yC3cwDnp7g',
            alias: 'la-taqueria-san-francisco-2',
            name: 'La Taqueria',
            image_url:
              'https://s3-media1.fl.yelpcdn.com/bphoto/7LqVKYVg2GdEFKI2CFL4cA/o.jpg',
            is_closed: false,
            url:
              'https://www.yelp.com/biz/la-taqueria-san-francisco-2?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ',
            review_count: 4172,
            categories: [
              {
                alias: 'mexican',
                title: 'Mexican'
              }
            ],
            rating: 4.0,
            coordinates: {
              latitude: 37.75088,
              longitude: -122.41805
            },
            transactions: ['delivery'],
            price: '$',
            location: {
              address1: '2889 Mission St',
              address2: '',
              address3: '',
              city: 'San Francisco',
              zip_code: '94110',
              country: 'US',
              state: 'CA',
              display_address: ['2889 Mission St', 'San Francisco, CA 94110']
            },
            phone: '+14152857117',
            display_phone: '(415) 285-7117',
            distance: 1363.9665911306222
          },
          {
            id: 'lJAGnYzku5zSaLnQ_T6_GQ',
            alias: 'brendas-french-soul-food-san-francisco-5',
            name: "Brenda's French Soul Food",
            image_url:
              'https://s3-media3.fl.yelpcdn.com/bphoto/sNIJnePGDenUOyewsD8tLg/o.jpg',
            is_closed: false,
            url:
              'https://www.yelp.com/biz/brendas-french-soul-food-san-francisco-5?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ',
            review_count: 11064,
            categories: [
              {
                alias: 'breakfast_brunch',
                title: 'Breakfast & Brunch'
              },
              {
                alias: 'southern',
                title: 'Southern'
              },
              {
                alias: 'cajun',
                title: 'Cajun/Creole'
              }
            ],
            rating: 4.0,
            coordinates: {
              latitude: 37.7829016035273,
              longitude: -122.419043442957
            },
            transactions: ['delivery'],
            price: '$$',
            location: {
              address1: '652 Polk St',
              address2: '',
              address3: '',
              city: 'San Francisco',
              zip_code: '94102',
              country: 'US',
              state: 'CA',
              display_address: ['652 Polk St', 'San Francisco, CA 94102']
            },
            phone: '+14153458100',
            display_phone: '(415) 345-8100',
            distance: 2441.1470385184384
          },
          {
            id: 'wEpiKz--Z2b1q_FSCCNiow',
            alias: 'lolinda-san-francisco',
            name: 'Lolinda',
            image_url:
              'https://s3-media2.fl.yelpcdn.com/bphoto/M8J3ehcOIRRI8ys1Q0hxtw/o.jpg',
            is_closed: false,
            url:
              'https://www.yelp.com/biz/lolinda-san-francisco?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ',
            review_count: 2013,
            categories: [
              {
                alias: 'steak',
                title: 'Steakhouses'
              },
              {
                alias: 'tapasmallplates',
                title: 'Tapas/Small Plates'
              },
              {
                alias: 'latin',
                title: 'Latin American'
              }
            ],
            rating: 4.0,
            coordinates: {
              latitude: 37.7566658,
              longitude: -122.419116
            },
            transactions: ['delivery'],
            price: '$$$',
            location: {
              address1: '2518 Mission St',
              address2: '',
              address3: '',
              city: 'San Francisco',
              zip_code: '94110',
              country: 'US',
              state: 'CA',
              display_address: ['2518 Mission St', 'San Francisco, CA 94110']
            },
            phone: '+14155506970',
            display_phone: '(415) 550-6970',
            distance: 797.9139761919113
          },
          {
            id: 'aVskw5NKrs7ibAQ54E_bZw',
            alias: 'u-dessert-story-san-francisco-5',
            name: 'U :Dessert Story',
            image_url:
              'https://s3-media1.fl.yelpcdn.com/bphoto/El0ZEgoggzydP9LqCT0SLg/o.jpg',
            is_closed: false,
            url:
              'https://www.yelp.com/biz/u-dessert-story-san-francisco-5?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ',
            review_count: 1490,
            categories: [
              {
                alias: 'desserts',
                title: 'Desserts'
              }
            ],
            rating: 4.5,
            coordinates: {
              latitude: 37.7642642124321,
              longitude: -122.430517340788
            },
            transactions: ['restaurant_reservation', 'delivery', 'pickup'],
            price: '$$',
            location: {
              address1: '3489 16th St',
              address2: '',
              address3: null,
              city: 'San Francisco',
              zip_code: '94114',
              country: 'US',
              state: 'CA',
              display_address: ['3489 16th St', 'San Francisco, CA 94114']
            },
            phone: '+14157963633',
            display_phone: '(415) 796-3633',
            distance: 516.157771354776
          },
          {
            id: 'ciEDsTWhajcdL3KuJqBRlw',
            alias: 'espetus-brazilian-steak-house-san-francisco',
            name: 'Espetus Brazilian Steak House',
            image_url:
              'https://s3-media4.fl.yelpcdn.com/bphoto/F9G1pFFitfi9F4rJw_nrpQ/o.jpg',
            is_closed: false,
            url:
              'https://www.yelp.com/biz/espetus-brazilian-steak-house-san-francisco?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ',
            review_count: 3449,
            categories: [
              {
                alias: 'steak',
                title: 'Steakhouses'
              },
              {
                alias: 'latin',
                title: 'Latin American'
              },
              {
                alias: 'brazilian',
                title: 'Brazilian'
              }
            ],
            rating: 4.0,
            coordinates: {
              latitude: 37.7733327504928,
              longitude: -122.422131667494
            },
            transactions: ['restaurant_reservation', 'delivery'],
            price: '$$$',
            location: {
              address1: '1686 Market St',
              address2: '',
              address3: '',
              city: 'San Francisco',
              zip_code: '94102',
              country: 'US',
              state: 'CA',
              display_address: ['1686 Market St', 'San Francisco, CA 94102']
            },
            phone: '+14155528792',
            display_phone: '(415) 552-8792',
            distance: 1343.1185473317478
          },
          {
            id: '76smcUUGRvq3k1MVPUXbnA',
            alias: 'mitchells-ice-cream-san-francisco',
            name: "Mitchell's Ice Cream",
            image_url:
              'https://s3-media2.fl.yelpcdn.com/bphoto/xBdlIh2tJUz8zr4ajXwKfg/o.jpg',
            is_closed: false,
            url:
              'https://www.yelp.com/biz/mitchells-ice-cream-san-francisco?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ',
            review_count: 4114,
            categories: [
              {
                alias: 'icecream',
                title: 'Ice Cream & Frozen Yogurt'
              },
              {
                alias: 'customcakes',
                title: 'Custom Cakes'
              }
            ],
            rating: 4.5,
            coordinates: {
              latitude: 37.744221,
              longitude: -122.422791
            },
            transactions: ['delivery', 'pickup'],
            price: '$',
            location: {
              address1: '688 San Jose Ave',
              address2: '',
              address3: '',
              city: 'San Francisco',
              zip_code: '94110',
              country: 'US',
              state: 'CA',
              display_address: ['688 San Jose Ave', 'San Francisco, CA 94110']
            },
            phone: '+14156482300',
            display_phone: '(415) 648-2300',
            distance: 1948.5093701777848
          },
          {
            id: 'dMlsQsPU8Y_oiPYC5hHi2A',
            alias: 'frances-san-francisco',
            name: 'Frances',
            image_url:
              'https://s3-media2.fl.yelpcdn.com/bphoto/mJRJodU9-9H4Hs_-p6qj8g/o.jpg',
            is_closed: false,
            url:
              'https://www.yelp.com/biz/frances-san-francisco?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ',
            review_count: 1500,
            categories: [
              {
                alias: 'newamerican',
                title: 'American (New)'
              },
              {
                alias: 'desserts',
                title: 'Desserts'
              },
              {
                alias: 'wine_bars',
                title: 'Wine Bars'
              }
            ],
            rating: 4.5,
            coordinates: {
              latitude: 37.7627220154927,
              longitude: -122.432276324008
            },
            transactions: ['delivery'],
            price: '$$$',
            location: {
              address1: '3870 17th St',
              address2: '',
              address3: '',
              city: 'San Francisco',
              zip_code: '94114',
              country: 'US',
              state: 'CA',
              display_address: ['3870 17th St', 'San Francisco, CA 94114']
            },
            phone: '+14156213870',
            display_phone: '(415) 621-3870',
            distance: 590.1604832757148
          },
          {
            id: '47OC_X6KkiDDQ4jwoCUjFg',
            alias: 'humphry-slocombe-ice-cream-san-francisco',
            name: 'Humphry Slocombe Ice Cream',
            image_url:
              'https://s3-media1.fl.yelpcdn.com/bphoto/N9XikmqttZy5StpPxkJing/o.jpg',
            is_closed: false,
            url:
              'https://www.yelp.com/biz/humphry-slocombe-ice-cream-san-francisco?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ',
            review_count: 3404,
            categories: [
              {
                alias: 'icecream',
                title: 'Ice Cream & Frozen Yogurt'
              }
            ],
            rating: 4.0,
            coordinates: {
              latitude: 37.75279,
              longitude: -122.4122
            },
            transactions: ['delivery'],
            price: '$',
            location: {
              address1: '2790A Harrison St',
              address2: '',
              address3: '',
              city: 'San Francisco',
              zip_code: '94110',
              country: 'US',
              state: 'CA',
              display_address: ['2790A Harrison St', 'San Francisco, CA 94110']
            },
            phone: '+14155506971',
            display_phone: '(415) 550-6971',
            distance: 1540.4078308826167
          },
          {
            id: 'AfqpSxetSUMc63ZPCfbneg',
            alias: 'craftsman-and-wolves-san-francisco',
            name: 'Craftsman and Wolves',
            image_url:
              'https://s3-media2.fl.yelpcdn.com/bphoto/G9ukcdVO74PJcLSlxwDHBQ/o.jpg',
            is_closed: false,
            url:
              'https://www.yelp.com/biz/craftsman-and-wolves-san-francisco?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ',
            review_count: 1565,
            categories: [
              {
                alias: 'bakeries',
                title: 'Bakeries'
              },
              {
                alias: 'cakeshop',
                title: 'Patisserie/Cake Shop'
              },
              {
                alias: 'coffee',
                title: 'Coffee & Tea'
              }
            ],
            rating: 4.0,
            coordinates: {
              latitude: 37.76090610988245,
              longitude: -122.42168263228955
            },
            transactions: ['delivery', 'pickup'],
            price: '$$',
            location: {
              address1: '746 Valencia St',
              address2: '',
              address3: '',
              city: 'San Francisco',
              zip_code: '94110',
              country: 'US',
              state: 'CA',
              display_address: ['746 Valencia St', 'San Francisco, CA 94110']
            },
            phone: '+14159137713',
            display_phone: '(415) 913-7713',
            distance: 362.7345935184126
          }
        ],
        total: 3600,
        region: {
          center: {
            longitude: -122.425717,
            latitude: 37.761591
          }
        }
      };

      const expectation = [
        {
          name: 'Bi-Rite Creamery',
          image_url:
            'https://s3-media2.fl.yelpcdn.com/bphoto/iPNJKlOQ7-eyqa4Yv2r2BA/o.jpg',
          price: '$',
          rating: 4.5,
          url:
            'https://www.yelp.com/biz/bi-rite-creamery-san-francisco?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ'
        },
        {
          name: 'Tartine Bakery & Cafe',
          image_url:
            'https://s3-media2.fl.yelpcdn.com/bphoto/nPUUXYVVa3CHJh5yzH8Xnw/o.jpg',
          price: '$$',
          rating: 4,
          url:
            'https://www.yelp.com/biz/tartine-bakery-and-cafe-san-francisco?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ'
        },
        {
          name: 'Mission Dolores Park',
          image_url:
            'https://s3-media1.fl.yelpcdn.com/bphoto/MDabhC69akFE2o21s7gtEg/o.jpg',
          rating: 4.5,
          url:
            'https://www.yelp.com/biz/mission-dolores-park-san-francisco?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ'
        },
        {
          name: 'El Farolito',
          image_url:
            'https://s3-media1.fl.yelpcdn.com/bphoto/gcC2Uwtu5raP13D3jWYm0Q/o.jpg',
          price: '$',
          rating: 4,
          url:
            'https://www.yelp.com/biz/el-farolito-san-francisco-2?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ'
        },
        {
          name: 'Foreign Cinema',
          image_url:
            'https://s3-media3.fl.yelpcdn.com/bphoto/cw5y2LSOIE-EVNjKK_d7SQ/o.jpg',
          price: '$$$',
          rating: 4,
          url:
            'https://www.yelp.com/biz/foreign-cinema-san-francisco?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ'
        },
        {
          name: 'Kitchen Story',
          image_url:
            'https://s3-media3.fl.yelpcdn.com/bphoto/XIhdtd0fB2P_v_qhh1hWbg/o.jpg',
          price: '$$',
          rating: 4,
          url:
            'https://www.yelp.com/biz/kitchen-story-san-francisco?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ'
        },
        {
          name: 'Garden Creamery',
          image_url:
            'https://s3-media2.fl.yelpcdn.com/bphoto/VUfUgl5k7kAfmzjeb95_UA/o.jpg',
          price: '$',
          rating: 4.5,
          url:
            'https://www.yelp.com/biz/garden-creamery-san-francisco-2?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ'
        },
        {
          name: 'Pizzeria Delfina - Mission',
          image_url:
            'https://s3-media3.fl.yelpcdn.com/bphoto/mXfuUNiaoGaeg7ra4IgcJQ/o.jpg',
          price: '$$',
          rating: 4,
          url:
            'https://www.yelp.com/biz/pizzeria-delfina-mission-san-francisco?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ'
        },
        {
          name: 'Shizen Vegan Sushi Bar & Izakaya',
          image_url:
            'https://s3-media4.fl.yelpcdn.com/bphoto/-1BWnyjrsDmTmXH_3wZl_w/o.jpg',
          price: '$$',
          rating: 4.5,
          url:
            'https://www.yelp.com/biz/shizen-vegan-sushi-bar-and-izakaya-san-francisco?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ'
        },
        {
          name: 'Loló',
          image_url:
            'https://s3-media4.fl.yelpcdn.com/bphoto/9fPMGo5daNzQ41ckzW4CZg/o.jpg',
          price: '$$',
          rating: 4,
          url:
            'https://www.yelp.com/biz/lol%C3%B3-san-francisco-4?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ'
        },
        {
          name: 'Beretta',
          image_url:
            'https://s3-media1.fl.yelpcdn.com/bphoto/OnjVYibgMoQRyRNuqZGCIA/o.jpg',
          price: '$$',
          rating: 4,
          url:
            'https://www.yelp.com/biz/beretta-san-francisco?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ'
        },
        {
          name: 'La Taqueria',
          image_url:
            'https://s3-media1.fl.yelpcdn.com/bphoto/7LqVKYVg2GdEFKI2CFL4cA/o.jpg',
          price: '$',
          rating: 4,
          url:
            'https://www.yelp.com/biz/la-taqueria-san-francisco-2?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ'
        },
        {
          name: "Brenda's French Soul Food",
          image_url:
            'https://s3-media3.fl.yelpcdn.com/bphoto/sNIJnePGDenUOyewsD8tLg/o.jpg',
          price: '$$',
          rating: 4,
          url:
            'https://www.yelp.com/biz/brendas-french-soul-food-san-francisco-5?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ'
        },
        {
          name: 'Lolinda',
          image_url:
            'https://s3-media2.fl.yelpcdn.com/bphoto/M8J3ehcOIRRI8ys1Q0hxtw/o.jpg',
          price: '$$$',
          rating: 4,
          url:
            'https://www.yelp.com/biz/lolinda-san-francisco?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ'
        },
        {
          name: 'U :Dessert Story',
          image_url:
            'https://s3-media1.fl.yelpcdn.com/bphoto/El0ZEgoggzydP9LqCT0SLg/o.jpg',
          price: '$$',
          rating: 4.5,
          url:
            'https://www.yelp.com/biz/u-dessert-story-san-francisco-5?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ'
        },
        {
          name: 'Espetus Brazilian Steak House',
          image_url:
            'https://s3-media4.fl.yelpcdn.com/bphoto/F9G1pFFitfi9F4rJw_nrpQ/o.jpg',
          price: '$$$',
          rating: 4,
          url:
            'https://www.yelp.com/biz/espetus-brazilian-steak-house-san-francisco?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ'
        },
        {
          name: "Mitchell's Ice Cream",
          image_url:
            'https://s3-media2.fl.yelpcdn.com/bphoto/xBdlIh2tJUz8zr4ajXwKfg/o.jpg',
          price: '$',
          rating: 4.5,
          url:
            'https://www.yelp.com/biz/mitchells-ice-cream-san-francisco?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ'
        },
        {
          name: 'Frances',
          image_url:
            'https://s3-media2.fl.yelpcdn.com/bphoto/mJRJodU9-9H4Hs_-p6qj8g/o.jpg',
          price: '$$$',
          rating: 4.5,
          url:
            'https://www.yelp.com/biz/frances-san-francisco?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ'
        },
        {
          name: 'Humphry Slocombe Ice Cream',
          image_url:
            'https://s3-media1.fl.yelpcdn.com/bphoto/N9XikmqttZy5StpPxkJing/o.jpg',
          price: '$',
          rating: 4,
          url:
            'https://www.yelp.com/biz/humphry-slocombe-ice-cream-san-francisco?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ'
        },
        {
          name: 'Craftsman and Wolves',
          image_url:
            'https://s3-media2.fl.yelpcdn.com/bphoto/G9ukcdVO74PJcLSlxwDHBQ/o.jpg',
          price: '$$',
          rating: 4,
          url:
            'https://www.yelp.com/biz/craftsman-and-wolves-san-francisco?adjust_creative=iEpLEToZM2OKmFPw8Zw8oQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iEpLEToZM2OKmFPw8Zw8oQ'
        }
      ];

      const finalReview = formatReviews(reviewObject.businesses);

      expect(finalReview).toEqual(expectation);
    });
  });
});
