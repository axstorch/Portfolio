/**
 * Portfolio visit webhook for Google Apps Script.
 *
 * Receives events forwarded by the /api/track function on Vercel, appends
 * them to a Sheet, and emails you. Free, no API keys, no third-party service.
 *
 * ------------------------------------------------------------------
 * SETUP (once, about five minutes)
 * ------------------------------------------------------------------
 * 1. Open https://script.google.com and create a project for yourself.
 * 2. Paste this whole file into Code.gs.
 * 3. Fill in ALERT_TO at the top with the Gmail address you want the alerts
 *    sent to (usually the account that owns the script).
 * 4. Deploy > New deployment > type "Web app".
 *      Execute as:      Me
 *      Who has access:  Anyone            <- must be Anyone, not "Anyone with
 *                                             a Google account", because the
 *                                             request comes from Vercel with
 *                                             no Google session attached.
 * 5. Copy the deployment URL. It looks like:
 *      https://script.google.com/macros/s/AKfycbXXXXXXXX/exec
 * 6. Put it in Vercel as the TRACK_WEBHOOK_URL environment variable
 *    (Settings > Environment Variables, then redeploy).
 * 7. Run setupDigest() once from the editor to get the daily summary email.
 *
 * The log is created once, on the first event: a spreadsheet named
 * "Portfolio visits" in your Drive, with a single tab called "Visits".
 * Every alert email links straight to it, and whereIsMyLog() emails the
 * link on demand, so there is never any hunting for the right file.
 *
 * To test before deploying the site: open the deployment URL in a browser tab.
 * The script returns a JSON ok. That only proves the script is live; the Sheet
 * is written on the first real visitor, or by running testEvent() from here.
 */

/** Where the alerts go. Change this to your own address. */
var ALERT_TO = 'akshatsaxena7974@gmail.com';

var CONFIG = {
  SPREADSHEET_NAME: 'Portfolio visits',
  SHEET_NAME: 'Visits',
  DAILY_DIGEST: true,
  /** Timezone for the digest, e.g. 'Asia/Kolkata'. */
  TIMEZONE: 'Asia/Kolkata',
};

/** Script property holding the log's file id, so it is only ever made once. */
var SPREADSHEET_ID_KEY = 'LOG_SPREADSHEET_ID';

/** Column order for the Sheet. Changing this changes the Sheet's headers. */
var COLUMNS = [
  'Time',
  'Event',
  'Page',
  'Referrer',
  'Country',
  'City',
  'Device',
  'Browser',
  'OS',
  'Screen',
  'Language',
  'Timezone',
  'Target',
  'Link text',
];

var LABELS = {
  page_view: 'opened the home page',
  case_study_view: 'opened a case study',
  case_study_click: 'clicked a case study',
  resume_click: 'DOWNLOADED YOUR RESUME',
  document_click: 'opened an attachment',
  contact_click: 'tried to email you',
  outbound_click: 'clicked an outbound link',
  engagement: 'read further',
  error: 'hit an error',
};

/** Human summary of where a visit came from. */
function describeReferrer(ref) {
  if (!ref) return 'direct, no referrer (typed the link or a bookmark)';
  try {
    var url = new URL(ref);
    var host = url.hostname.replace(/^www\./, '');
    if (/google|bing|duckduckgo|yahoo|baidu|yandex/.test(host)) {
      return 'search engine: ' + host;
    }
    if (/linkedin/.test(host)) return 'LinkedIn';
    if (/x\.com|twitter|t\.co/.test(host)) return 'X / Twitter';
    if (/reddit/.test(host)) return 'Reddit';
    if (/whatsapp/.test(host)) return 'WhatsApp';
    if (/slack|discord/.test(host)) return host;
    return host + (url.pathname === '/' ? '' : url.pathname);
  } catch (e) {
    return ref;
  }
}

/** Case study slug turned into a name, e.g. 'traya' becomes 'the Traya case study'. */
function describePage(path) {
  if (!path || path === '/') return 'the home page';
  var m = path.match(/^\/work\/([a-z0-9-]+)/);
  if (m) {
    var slug = m[1];
    return 'the ' + slug.charAt(0).toUpperCase() + slug.slice(1) + ' case study';
  }
  return path;
}

/** One-line summary for the email subject. */
function subjectFor(d) {
  var who = [d.city, d.country].filter(Boolean).join(', ');
  if (d.event === 'resume_click') {
    return 'RESUME DOWNLOADED on your portfolio' + (who ? ' from ' + who : '');
  }
  var label = LABELS[d.event] || d.event;
  return 'Portfolio: someone ' + label + (who ? ' from ' + who : '');
}

function buildEmail(d) {
  var device = [d.device, d.os, d.browser].filter(Boolean).join(' / ');
  var where = [d.city, d.region, d.country].filter(Boolean).join(', ') || 'unknown location';
  var log = logUrl();
  var rows = [
    ['What happened', LABELS[d.event] || d.event],
    ['Page', describePage(d.path)],
    ['When', new Date(d.ts).toString()],
    ['Where', where],
    ['Device', device || 'unknown'],
    ['Screen', d.screen || 'unknown'],
    ['Language', d.language || 'unknown'],
    ['Their timezone (UTC offset)', d.timezone || 'unknown'],
    ['Came from', describeReferrer(d.referrer)],
    ['Link text', d.label || ''],
  ];

  var tr = rows
    .map(function (r) {
      return (
        '<tr>' +
        '<td style="padding:8px 16px 8px 0;color:#888;font:12px Arial,sans-serif;' +
        'text-transform:uppercase;letter-spacing:.08em;white-space:nowrap;vertical-align:top">' +
        r[0] +
        '</td>' +
        '<td style="padding:8px 0;color:#1c1c1c;font:14px Arial,sans-serif">' +
        (r[1] || '') +
        '</td></tr>'
      );
    })
    .join('');

  var accent = d.event === 'resume_click' ? '#B45309' : '#1C1C1C';

  return (
    '<div style="max-width:560px;font-family:Arial,sans-serif">' +
    '<div style="border-left:3px solid ' + accent + ';padding-left:16px;margin-bottom:20px">' +
    '<div style="font:12px Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;' +
    'color:#888;margin-bottom:4px">' + accent + '</div>' +
    '<div style="font:20px Georgia,serif;color:#1c1c1c">' + subjectFor(d) + '</div>' +
    '</div>' +
    '<table style="border-collapse:collapse;width:100%">' + tr + '</table>' +
    '<div style="margin-top:24px">' +
    '<a href="https://akshatsaxena.dev" style="font:12px Arial,sans-serif;color:#1c1c1c;' +
    'border-bottom:1px solid #1c1c1c;padding-bottom:2px;text-decoration:none">Open your site</a>' +
    (log
      ? ' &nbsp;&middot;&nbsp; <a href="' + log + '" style="font:12px Arial,sans-serif;color:#1c1c1c;' +
        'border-bottom:1px solid #1c1c1c;padding-bottom:2px;text-decoration:none">View the full log</a>'
      : '') +
    '<div style="margin-top:16px;font:11px Arial,sans-serif;color:#aaa">' +
    'Sent by the Apps Script webhook behind /api/track. Bots are filtered out and ' +
    'repeat visits within a few minutes are collapsed, so a quiet week means a quiet week.' +
    '</div></div></div>'
  );
}

function sendAlert(d) {
  MailApp.sendEmail({
    to: ALERT_TO,
    subject: subjectFor(d),
    body: 'New visit to your portfolio site.\n\n' + JSON.stringify(d, null, 2),
    htmlBody: buildEmail(d),
  });
}

/**
 * Finds the log, and creates it only if it genuinely does not exist yet.
 *
 * The id is cached in script properties, which is what stops a new
 * spreadsheet being created on every single event. Never call
 * SpreadsheetApp.getActiveSpreadsheet() for this: a script created from
 * script.google.com is standalone, so that call returns null every time.
 */
function getSheet_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty(SPREADSHEET_ID_KEY);

  if (id) {
    try {
      return ensureTab_(SpreadsheetApp.openById(id));
    } catch (e) {
      // The log was deleted or moved, so the cached id is stale.
      props.deleteProperty(SPREADSHEET_ID_KEY);
    }
  }

  // Second chance: adopt a log that already exists by name, so a redeploy
  // cannot litter Drive with copies.
  try {
    var files = DriveApp.getFilesByName(CONFIG.SPREADSHEET_NAME);
    if (files.hasNext()) {
      var found = SpreadsheetApp.openById(files.next().getId());
      props.setProperty(SPREADSHEET_ID_KEY, found.getId());
      return ensureTab_(found);
    }
  } catch (e) {
    // No Drive scope, or no match. Creating a log is the safe fallback.
  }

  var created = SpreadsheetApp.create(CONFIG.SPREADSHEET_NAME);
  props.setProperty(SPREADSHEET_ID_KEY, created.getId());
  return ensureTab_(created);
}

/** Returns the Visits tab, creating and formatting it the first time only. */
function ensureTab_(ss) {
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (sheet) return sheet;

  sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  sheet.appendRow(COLUMNS);
  sheet.setFrozenRows(1);
  sheet
    .getRange(1, 1, 1, COLUMNS.length)
    .setFontWeight('bold')
    .setBackground('#F4F4F0');

  /*
   * SpreadsheetApp.create() leaves an empty default tab behind. That is how a
   * log ends up looking empty: the data is in the other tab, and the tab
   * people open first is the blank one. Remove it.
   */
  var sheets = ss.getSheets();
  if (sheets.length > 1) {
    for (var i = 0; i < sheets.length; i++) {
      if (sheets[i].getName() !== CONFIG.SHEET_NAME && sheets[i].getLastRow() === 0) {
        ss.deleteSheet(sheets[i]);
      }
    }
  }
  ss.setActiveSheet(sheet);
  return sheet;
}

/** Direct link to the log, so you never have to hunt through Drive again. */
function logUrl() {
  try {
    var id = PropertiesService.getScriptProperties().getProperty(SPREADSHEET_ID_KEY);
    if (id) return 'https://docs.google.com/spreadsheets/d/' + id + '/edit';
  } catch (e) {
    /* fall through */
  }
  return '';
}

/** Run this from the editor to be told where the log ended up. */
function whereIsMyLog() {
  var url = logUrl();
  MailApp.sendEmail({
    to: ALERT_TO,
    subject: 'Your portfolio visit log',
    body: url ? 'Here is your log:\n' + url : 'No log has been created yet.',
  });
}

/** Runs for every POST from /api/track. */
function doPost(e) {
  try {
    var d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (!d || !d.event) {
      return json({ ok: false, error: 'missing event' });
    }

    getSheet_().appendRow([
      new Date(d.ts || Date.now()),
      LABELS[d.event] || d.event,
      d.path || '/',
      d.referrer || '',
      d.country || '',
      d.city || '',
      d.device || '',
      d.browser || '',
      d.os || '',
      d.screen || '',
      d.language || '',
      d.timezone || '',
      d.target || '',
      d.label || '',
    ]);

    if (d.alert) {
      try {
        sendAlert(d);
      } catch (mailErr) {
        // A failed alert must not stop the visit being logged.
        console.error('alert failed: ' + mailErr);
      }
    }

    return json({ ok: true });
  } catch (err) {
    console.error(String(err));
    return json({ ok: false, error: String(err) });
  }
}

/** Opening the deployment URL in a browser, to confirm it is live. */
function doGet() {
  return json({ ok: true, service: 'portfolio-track', events: Object.keys(LABELS) });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/* ------------------------------------------------------------------ */
/* Daily summary                                                        */
/* ------------------------------------------------------------------ */

/**
 * Run this once from the editor to schedule a daily email. Apps Script
 * triggers do not survive a change to this file's name, so keep the name.
 */
function setupDigest() {
  ScriptApp.newTrigger('sendDailyDigest').timeBased().everyDays(1).atHour(9).create();
}

/** Delete the trigger first, or you will get the digest twice a day. */
function removeDigest() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'sendDailyDigest') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}

/**
 * Yesterday in one email: total visits, every resume download, which case
 * study got read, and where the traffic came from. This is the email that
 * tells you whether a recruiter actually looked, which single-event alerts
 * cannot do.
 */
function sendDailyDigest() {
  var sheet = getSheet_();
  var rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return;

  var headers = rows[0];
  var col = {};
  headers.forEach(function (h, i) {
    col[String(h)] = i;
  });

  var end = new Date();
  var start = new Date(end.getTime() - 24 * 60 * 60 * 1000);

  var total = 0;
  var resumes = [];
  var pages = {};
  var sources = {};
  var countries = {};

  for (var i = 1; i < rows.length; i++) {
    var when = rows[i][col['Time']];
    if (!(when instanceof Date) || when < start || when > end) continue;
    total++;

    var event = String(rows[i][col['Event']]);
    var path = String(rows[i][col['Page']]);

    pages[path] = (pages[path] || 0) + 1;
    sources[describeReferrer(String(rows[i][col['Referrer']] || ''))] =
      (sources[describeReferrer(String(rows[i][col['Referrer']] || ''))] || 0) + 1;
    var country = String(rows[i][col['Country']] || 'unknown');
    countries[country] = (countries[country] || 0) + 1;

    if (/RESUME/.test(event)) {
      resumes.push({
        when: when,
        where: [rows[i][col['City']], rows[i][col['Country']]].filter(Boolean).join(', '),
        via: describeReferrer(String(rows[i][col['Referrer']] || '')),
        device: [rows[i][col['Device']], rows[i][col['OS']], rows[i][col['Browser']]]
          .filter(Boolean)
          .join(' / '),
      });
    }
  }

  if (total === 0) return;

  function list(obj) {
    return Object.keys(obj)
      .sort(function (a, b) {
        return obj[b] - obj[a];
      })
      .slice(0, 8)
      .map(function (k) {
        return '<li style="margin:4px 0;font:13px Arial,sans-serif;color:#1c1c1c">' +
          k + ' <span style="color:#aaa">x' + obj[k] + '</span></li>';
      })
      .join('');
  }

  var resumeBlock = resumes.length
    ? '<h3 style="font:12px Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;' +
      'color:#B45309;margin:24px 0 8px">Resume downloads (' + resumes.length + ')</h3>' +
      resumes
        .map(function (r) {
          return (
            '<div style="font:13px Arial,sans-serif;color:#1c1c1c;border-left:2px solid #B45309;' +
            'padding-left:12px;margin-bottom:12px">' +
            '<b>' + r.when.toLocaleString() + '</b><br>' + (r.where || 'unknown location') +
            '<br>' + r.device + '<br><span style="color:#888">via ' + r.via + '</span></div>'
          );
        })
        .join('')
    : '<p style="font:13px Arial,sans-serif;color:#888">No resume downloads.</p>';

  MailApp.sendEmail({
    to: ALERT_TO,
    subject: total + ' visit' + (total === 1 ? '' : 's') + ' yesterday, ' +
      resumes.length + ' resume download' + (resumes.length === 1 ? '' : 's'),
    htmlBody:
      '<div style="max-width:560px;font-family:Arial,sans-serif">' +
      '<div style="font:24px Georgia,serif;color:#1c1c1c;margin-bottom:4px">' +
      total + ' visit' + (total === 1 ? '' : 's') + ' yesterday</div>' +
      '<div style="font:12px Arial,sans-serif;color:#888;margin-bottom:8px">' +
      start.toDateString() + '</div>' +
      resumeBlock +
      '<h3 style="font:12px Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;' +
      'color:#888;margin:24px 0 8px">Pages</h3><ul style="padding-left:18px">' +
      list(pages) + '</ul>' +
      '<h3 style="font:12px Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;' +
      'color:#888;margin:24px 0 8px">Came from</h3><ul style="padding-left:18px">' +
      list(sources) + '</ul>' +
      '<h3 style="font:12px Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;' +
      'color:#888;margin:24px 0 8px">Countries</h3><ul style="padding-left:18px">' +
      list(countries) + '</ul>' +
      '</div>',
  });
}

/** Manual test: writes a fake visit and emails it. Run from the editor. */
function testEvent() {
  doPost({
    postData: {
      contents: JSON.stringify({
        event: 'resume_click',
        alert: true,
        ts: Date.now(),
        path: '/work/traya',
        referrer: 'https://www.linkedin.com/',
        country: 'IN',
        region: 'Karnataka',
        city: 'Bengaluru',
        device: 'Mobile',
        browser: 'Safari',
        os: 'iOS',
        screen: '390x844',
        language: 'en-IN',
        timezone: '5.5',
        target: 'resume',
        label: 'Resume',
      }),
    },
  });
}