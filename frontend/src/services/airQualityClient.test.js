import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateSubIndex,
  getCategoryInfo,
  calculateIndiaAqi,
  CPCB_BREAKPOINTS,
  CPCB_CATEGORIES,
} from './airQualityClient.js';

describe('Client-Side CPCB NAQI Engine Tests', () => {
  it('calculates PM2.5 sub-indices accurately at CPCB breakpoints', () => {
    // 0 - 30 -> 0 - 50 (Good)
    assert.strictEqual(calculateSubIndex(15.0, 'pm2_5'), 25);
    assert.strictEqual(calculateSubIndex(30.0, 'pm2_5'), 50);

    // 30.1 - 60 -> 51 - 100 (Satisfactory)
    assert.strictEqual(calculateSubIndex(60.0, 'pm2_5'), 100);

    // 60.1 - 90 -> 101 - 200 (Moderate)
    assert.strictEqual(calculateSubIndex(90.0, 'pm2_5'), 200);

    // 90.1 - 120 -> 201 - 300 (Poor)
    assert.strictEqual(calculateSubIndex(120.0, 'pm2_5'), 300);

    // 120.1 - 250 -> 301 - 400 (Very Poor)
    assert.strictEqual(calculateSubIndex(250.0, 'pm2_5'), 400);

    // 250.1 - 500 -> 401 - 500 (Severe)
    assert.strictEqual(calculateSubIndex(500.0, 'pm2_5'), 500);
  });

  it('calculates PM10 sub-indices accurately', () => {
    assert.strictEqual(calculateSubIndex(25.0, 'pm10'), 25);
    assert.strictEqual(calculateSubIndex(50.0, 'pm10'), 50);
    assert.strictEqual(calculateSubIndex(100.0, 'pm10'), 100);
    assert.strictEqual(calculateSubIndex(250.0, 'pm10'), 200);
    assert.strictEqual(calculateSubIndex(350.0, 'pm10'), 300);
    assert.strictEqual(calculateSubIndex(430.0, 'pm10'), 400);
  });

  it('calculates NO2, SO2, O3, CO sub-indices correctly', () => {
    // NO2: 0-40 -> 0-50
    assert.strictEqual(calculateSubIndex(40.0, 'no2'), 50);

    // SO2: 0-40 -> 0-50
    assert.strictEqual(calculateSubIndex(40.0, 'so2'), 50);

    // O3: 0-50 -> 0-50
    assert.strictEqual(calculateSubIndex(50.0, 'o3'), 50);

    // CO: 0-1.0 -> 0-50 (in mg/m3)
    assert.strictEqual(calculateSubIndex(1.0, 'co'), 50);
  });

  it('correctly maps AQI values to official CPCB categories and colors', () => {
    const good = getCategoryInfo(45);
    assert.strictEqual(good.category, 'Good');
    assert.strictEqual(good.color, '#10b981');

    const satisfactory = getCategoryInfo(75);
    assert.strictEqual(satisfactory.category, 'Satisfactory');

    const moderate = getCategoryInfo(160);
    assert.strictEqual(moderate.category, 'Moderate');

    const poor = getCategoryInfo(250);
    assert.strictEqual(poor.category, 'Poor');

    const veryPoor = getCategoryInfo(350);
    assert.strictEqual(veryPoor.category, 'Very Poor');

    const severe = getCategoryInfo(450);
    assert.strictEqual(severe.category, 'Severe');
  });

  it('determines the dominant pollutant based on max sub-index', () => {
    const pollutants = {
      pm2_5: 85.0, // Sub-index in Moderate (~183)
      pm10: 45.0,  // Sub-index in Good (45)
      no2: 20.0,
      o3: 30.0,
      so2: 10.0,
      co: 0.5,
    };

    const res = calculateIndiaAqi(pollutants);
    assert.strictEqual(res.dominant_pollutant, 'PM2.5');
    assert.ok(res.aqi > 150 && res.aqi <= 200);
    assert.strictEqual(res.category, 'Moderate');
  });

  it('gracefully handles missing, null, or negative pollutant concentrations', () => {
    assert.strictEqual(calculateSubIndex(null, 'pm2_5'), null);
    assert.strictEqual(calculateSubIndex(undefined, 'pm2_5'), null);
    assert.strictEqual(calculateSubIndex(-10.0, 'pm2_5'), null);

    const emptyRes = calculateIndiaAqi({});
    assert.strictEqual(emptyRes.aqi, 0);
    assert.strictEqual(emptyRes.category, 'Good');
  });

  it('verifies CPCB breakpoints and 6-tier categories structure', () => {
    assert.strictEqual(CPCB_BREAKPOINTS.pm2_5.length, 6);
    assert.strictEqual(CPCB_CATEGORIES.length, 6);
    assert.strictEqual(CPCB_CATEGORIES[0].category, 'Good');
    assert.strictEqual(CPCB_CATEGORIES[5].category, 'Severe');
  });
});
