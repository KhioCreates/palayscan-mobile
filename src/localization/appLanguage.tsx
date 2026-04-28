import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type AppLanguage = 'en' | 'fil';

const STORAGE_KEY = 'palayscan.language';

const baseFilipinoTranslations: Record<string, string> = {
  Home: 'Tahanan',
  Guide: 'Gabay',
  Scan: 'Scan',
  Planner: 'Plano',
  More: 'Iba pa',
  History: 'Kasaysayan',
  'Records and Help': 'Mga Tala at Tulong',
  'Saved Records': 'Naka-save na Tala',
  'Save record': 'I-save ang tala',
  'Safety and Privacy': 'Kaligtasan at Privacy',
  'Quick reminders before relying on scan or planner outputs.':
    'Mabilis na paalala bago umasa sa resulta ng scan o planner.',
  'Data Privacy': 'Privacy ng Datos',
  'Local records, scan image use, and device storage.':
    'Mga lokal na tala, paggamit ng larawan sa scan, at imbakan ng device.',
  'Scan Disclaimer': 'Paunawa sa Scan',
  'Image checks are a guide and should be verified in the field.':
    'Gabayan lang ang mga pagsusuri sa larawan at dapat beripikahin sa bukid.',
  'Planner Disclaimer': 'Paunawa sa Planner',
  'Crop calendars are estimates and can be adjusted.':
    'Tantya lang ang mga iskedyul ng taniman at puwedeng baguhin.',
  'About PALAYSCAN': 'Tungkol sa PALAYSCAN',
  'Project details and app scope.': 'Detalye ng proyekto at saklaw ng app.',
  'About the App': 'Tungkol sa App',
  'Project team, technology credits, and what PALAYSCAN can do.':
    'Pangkat ng proyekto, kredito sa teknolohiya, at kaya ng PALAYSCAN.',
  References: 'Mga Sanggunian',
  'Agriculture basis used by the guide and planner.':
    'Batayan sa agrikultura na ginamit sa gabay at planner.',
  'Reference Sources': 'Mga Sanggunian',
  'Sources used for guide wording and crop calendar logic.':
    'Mga sangguniang ginamit sa salita ng gabay at lohika ng crop calendar.',
  'Language / Wika': 'Wika',
  Language: 'Wika',
  'Choose your app language.': 'Piliin ang wika ng app.',
  'Choose the language used in the app.': 'Piliin ang wikang gagamitin sa app.',
  'Device code': 'Code ng device',
  'Use this code when requesting more scans.':
    'Gamitin ang code na ito kapag humihingi ng dagdag na scan.',
  'Loading code': 'Kinukuha ang code',
  English: 'Ingles',
  Filipino: 'Filipino',
  'Current app language': 'Kasalukuyang wika ng app',
  'Open the app in English or Filipino.': 'Buksan ang app sa Ingles o Filipino.',
  'App language': 'Wika ng app',
  'Guide Module': 'Modyul ng Gabay',
  'Palay field guide': 'Gabay sa palay sa bukid',
  'Browse palay varieties, pests, and diseases with clear notes and field reference photos.':
    'Tingnan ang mga variety ng palay, peste, at sakit na may malinaw na tala at mga larawang pang-gabay.',
  'Palay Varieties': 'Mga Variety ng Palay',
  Varieties: 'Variety',
  Pests: 'Peste',
  Diseases: 'Sakit',
  'Compare days to harvest, possible yield, grain type, and best field condition.':
    'Ihambing ang araw hanggang anihan, posibleng ani, uri ng butil, at pinakaangkop na kondisyon ng bukid.',
  'See common rice pests, visible damage signs, field actions, and prevention tips.':
    'Tingnan ang karaniwang peste ng palay, nakikitang pinsala, aksyon sa bukid, at mga paalala sa pag-iwas.',
  'Check rice disease signs, symptoms, field actions, and prevention tips in one local guide.':
    'Suriin ang palatandaan ng sakit ng palay, sintomas, aksyon sa bukid, at mga paalala sa pag-iwas sa isang lokal na gabay.',
  'Browse palay varieties': 'Tingnan ang mga variety ng palay',
  'Browse pests': 'Tingnan ang mga peste',
  'Browse diseases': 'Tingnan ang mga sakit',
  entries: 'mga tala',
  'entries saved': 'mga naka-save na tala',
  'Search': 'Hanapin',
  'No matching entries found': 'Walang tumugmang tala',
  'Try another keyword or clear the search to see the full offline guide list.':
    'Subukan ang ibang salita o linisin ang hanap para makita ang buong offline na gabay.',
  'Back to Guide': 'Bumalik sa Gabay',
  'Back to list': 'Bumalik sa listahan',
  'Section not found': 'Hindi nakita ang seksyon',
  'This guide section could not be loaded from local data.':
    'Hindi ma-load ang seksyong ito mula sa lokal na data.',
  'Search palay varieties': 'Hanapin ang mga variety ng palay',
  'Search rice varieties': 'Hanapin ang mga variety ng palay',
  'Search by variety name, for example Rc 222.':
    'Hanapin gamit ang pangalan ng variety, halimbawa Rc 222.',
  'Search by name or visible field sign.': 'Hanapin gamit ang pangalan o nakikitang palatandaan.',
  'palay varieties saved in this guide': 'mga variety ng palay na nasa gabay na ito',
  'guide topics saved in this section': 'mga paksang nasa seksyong ito',
  'Scan Module': 'Modyul ng Scan',
  'Scan a rice problem': 'I-scan ang problema sa palay',
  'Capture or upload rice photos, then review the photo focus before analysis.':
    'Kunan o i-upload ang mga larawan ng palay, tapos suriin ang focus ng larawan bago ang pagsusuri.',
  'Start field scan': 'Simulan ang scan sa bukid',
  'Use close, bright rice photos for better scan results.':
    'Gumamit ng malapit at maliwanag na larawan ng palay para mas maayos ang resulta.',
  Capture: 'Kunan',
  Upload: 'I-upload',
  'Open camera': 'Buksan ang camera',
  'Pick photo': 'Pumili ng larawan',
  'Photo focus': 'Pokus ng larawan',
  'Selected photos': 'Napiling mga larawan',
  'Checking photos': 'Sinusuri ang mga larawan',
  'Matching issue': 'Tinutugma ang problema',
  'Preparing result': 'Inihahanda ang resulta',
  'Analyzing photos': 'Sinusuri ang mga larawan',
  'Checking the rice photos and preparing a possible issue result.':
    'Sinusuri ang mga larawan ng palay at inihahanda ang posibleng problema.',
  'Add at least one rice photo before analyzing.':
    'Magdagdag muna ng kahit isang larawan ng palay bago magsuri.',
  'Confirm that the selected photos show the same rice problem before analyzing.':
    'Kumpirmahin na ang napiling mga larawan ay iisang problema sa palay bago magsuri.',
  'Analysis is already in progress. Please wait for it to finish.':
    'May kasalukuyang pagsusuri na. Pakihintay na matapos.',
  'Please wait {seconds}s before analyzing again.':
    'Pakihintay ng {seconds}s bago muling magsuri.',
  'Analyze {subject}.': 'Suriin ang {subject}.',
  'Analyze in {seconds}s': 'Suriin sa {seconds}s',
  'Scan limit reached for this session. Please try again later.':
    'Naabot na ang limit ng scan para sa sesyong ito. Subukan muli mamaya.',
  'You can send up to {max} photos in one scan.':
    'Maaari kang magpadala ng hanggang {max} larawan sa isang scan.',
  'Camera permission needed': 'Kailangan ang pahintulot sa camera',
  'Please allow camera access so you can capture a rice image for scanning.':
    'Payagan ang access sa camera para makakuha ng larawan ng palay para sa scan.',
  'Gallery permission needed': 'Kailangan ang pahintulot sa gallery',
  'Please allow photo library access so you can choose a rice image to scan.':
    'Payagan ang access sa photo library para makapili ng larawang palay na i-scan.',
  'Retake': 'Kunan muli',
  Replace: 'Palitan',
  'Optional notes': 'Opsyonal na tala',
  'Add short notes for this scan result later if needed.':
    'Maglagay ng maikling tala para sa resultang ito kung kailangan.',
  'I confirm these are clear rice leaf, stem, panicle, or field photos.':
    'Kinukumpirma ko na malinaw ang mga larawang ito ng dahon, tangkay, bunga, o bahagi ng bukid ng palay.',
  'These photos show the same rice problem from different angles.':
    'Iisang problema sa palay ang ipinapakita ng mga larawang ito mula sa iba-ibang anggulo.',
  Ready: 'Handa na',
  'Best photo set': 'Pinakamainam na set ng larawan',
  'Aim at the affected leaf, stem, panicle, or field patch.':
    'Ituon ang larawan sa apektadong dahon, tangkay, bunga, o bahagi ng bukid.',
  'Scan could not be completed': 'Hindi natapos ang scan',
  'The scan could not be completed. Check your connection and image, then try again.':
    'Hindi natapos ang scan. Suriin ang koneksyon at larawan, tapos subukan muli.',
  'No usable matches found': 'Walang maayos na tumugma',
  'The scan finished, but there were not enough usable matches to show a result. Try a clearer image.':
    'Natapos ang scan pero kulang ang maayos na tugma para makapagpakita ng resulta. Subukan ang mas malinaw na larawan.',
  'Review photos': 'Suriin ang mga larawan',
  'Confirm the rice photos before sending them to analysis.':
    'Kumpirmahin ang mga larawan ng palay bago ipadala para sa pagsusuri.',
  'Photo limit reached': 'Naabot na ang limit ng larawan',
  'Scan result': 'Resulta ng scan',
  'Review the possible issue and compare the field signs.':
    'Suriin ang posibleng problema at ihambing ang mga palatandaan sa bukid.',
  'Possible issue': 'Posibleng problema',
  'Non-plant image detected': 'Larawang hindi halaman',
  'Tap to check signs and next steps': 'Pindutin para tingnan ang mga palatandaan at susunod na hakbang',
  'Rice check warning': 'Babala sa pagsusuri ng palay',
  'Use this as a guide only. Check the field signs or ask your local agriculture office if needed.':
    'Gamitin lang ito bilang gabay. Suriin ang palatandaan sa bukid o magtanong sa lokal na tanggapan ng agrikultura kung kailangan.',
  'Other possible matches': 'Iba pang posibleng tugma',
  'Possible Scan Issue': 'Posibleng Problema sa Scan',
  'Next steps': 'Mga susunod na hakbang',
  'Use the scan as a guide, then check the field.':
    'Gamitin ang scan bilang gabay, tapos suriin ang bukid.',
  'Photos used for scan': 'Mga larawang ginamit sa scan',
  'Tap another match if the field signs look closer to it.':
    'Pindutin ang ibang tugma kung mas malapit iyon sa palatandaan sa bukid.',
  'About this possible issue': 'Tungkol sa posibleng problemang ito',
  'What you may see': 'Mga puwedeng makita',
  'Damage or signs': 'Pinsala o palatandaan',
  'What to do next': 'Ano ang susunod na gawin',
  'How to avoid it': 'Paano ito maiiwasan',
  'Reference details': 'Detalye ng sanggunian',
  'Scientific Name': 'Pang-agham na pangalan',
  'Current language': 'Kasalukuyang wika',
  'Language setting': 'Setting ng wika',
  'English language': 'Wikang Ingles',
  'Filipino language': 'Wikang Filipino',
  'Select English or Filipino.': 'Pumili ng Ingles o Filipino.',
  'Change the app language anytime in More.':
    'Palitan ang wika ng app anumang oras sa More.',
  'Scan history': 'Kasaysayan ng scan',
  'No saved scan history yet': 'Wala pang naka-save na kasaysayan ng scan',
  'Complete a scan and saved results will appear here automatically.':
    'Kapag may natapos na scan, lalabas dito ang na-save na resulta.',
  'Planner history': 'Kasaysayan ng planner',
  'No saved planner history yet': 'Wala pang naka-save na kasaysayan ng planner',
  'Generate a crop calendar and it will be saved locally here automatically.':
    'Gumawa ng crop calendar at awtomatiko itong mase-save dito sa device.',
  'Saved scan summary': 'Buod ng na-save na scan',
  'Mode: ': 'Mode: ',
  'Saved: ': 'Na-save: ',
  'Delete this scan': 'Burahin ang scan na ito',
  'Delete scan record': 'Burahin ang tala ng scan',
  'Remove this saved scan result from local history?':
    'Tanggalin ang na-save na resulta ng scan mula sa lokal na kasaysayan?',
  Cancel: 'Kanselahin',
  Delete: 'Burahin',
  'Scan record not found': 'Hindi nakita ang tala ng scan',
  'This saved scan could not be loaded from local history.':
    'Hindi ma-load ang na-save na scan mula sa lokal na kasaysayan.',
  'How to read the planner': 'Paano basahin ang planner',
  'How to use the calendar responsibly':
    'Paano gamitin nang tama ang calendar',
  'Current scope': 'Kasalukuyang saklaw',
  'The planner stays fully offline and uses local schedule rules only. It is meant to support planning, learning, and field organization use.':
    'Nanatiling offline ang planner at gumagamit lang ng lokal na mga patakaran sa iskedyul. Layon nitong tumulong sa pagpaplano, pagkatuto, at pag-aayos sa bukid.',
  'Simple privacy guidance for local app use': 'Simpleng gabay sa privacy para sa lokal na paggamit ng app',
  'PALAYSCAN is designed to keep most records on the device, while clearly warning users when image checking may involve an external service.':
    'Dinisenyo ang PALAYSCAN para manatili sa device ang karamihan ng tala, habang malinaw na nagbababala kapag ang pagsusuri ng larawan ay maaaring gumamit ng panlabas na serbisyo.',
  'What stays local': 'Ano ang nananatili sa device',
  'What may leave the device': 'Ano ang maaaring lumabas sa device',
  'Recommended user practice': 'Inirerekomendang gawi ng user',
  'If online image checking is enabled, a selected image may be sent to the configured Kindwise crop.health plant-health identification service after the app\'s pre-check safeguards pass.':
    'Kapag naka-on ang online image checking, maaaring ipadala ang napiling larawan sa naka-configure na Kindwise crop.health plant-health identification service matapos makapasa sa mga paunang pagsusuri ng app.',
  'Only clear rice field images should be submitted for online checking.':
    'Dapat malinaw na larawan ng palayan lamang ang isumite para sa online checking.',
  'Scan results are guide-only': 'Gabayan lamang ang mga resulta ng scan',
  'PALAYSCAN scan results are intended to help users review possible rice crop issues from an image. They should be treated as support information, not as a final field diagnosis.':
    'Layunin ng resulta ng scan ng PALAYSCAN na tulungan ang user na suriin ang posibleng problema sa palay mula sa larawan. Dapat itong ituring na gabay lamang, hindi pinal na diagnosis sa bukid.',
  'What affects the result': 'Ano ang nakaaapekto sa resulta',
  'How to use scan results': 'Paano gamitin ang resulta ng scan',
  'Built-in safeguards': 'Mga built-in na proteksyon',
  'Use scan results as a starting point for comparison, not a final diagnosis.':
    'Gamitin ang resulta ng scan bilang panimulang paghahambing, hindi pinal na diagnosis.',
  'Keep photos focused on rice leaves, stems, panicles, or field patches.':
    'Tiyaking nakatuon ang larawan sa dahon, tangkay, bunga, o bahagi ng bukid ng palay.',
  'Do not upload unrelated personal or sensitive images.':
    'Huwag mag-upload ng hindi kaugnay na personal o sensitibong larawan.',
  'Planner dates are estimated and adjustable':
    'Tantya at puwedeng baguhin ang mga petsa ng planner',
  'The PALAYSCAN planner is a local rule-based crop calendar that helps users organize activities from planting to harvest using planting method, planting date, and rice crop-stage references.':
    'Ang planner ng PALAYSCAN ay lokal na crop calendar na nakabatay sa mga panuntunan at tumutulong mag-ayos ng mga gawain mula pagtatanim hanggang anihan gamit ang paraan ng pagtatanim, petsa ng tanim, at sanggunian ng yugto ng palay.',
  'Planner activities are estimated timing guides. They are not exact prescriptions for every field, season, variety, or irrigation condition.':
    'Tantyang gabay lang ang mga aktibidad sa planner. Hindi ito eksaktong panuntunan para sa lahat ng bukid, panahon, variety, o kondisyon ng patubig.',
  'Users should adjust the saved activity dates and notes according to actual field conditions, local weather, variety used, irrigation schedule, and advice from local agricultural personnel.':
    'Dapat iangkop ng user ang mga naka-save na petsa at tala ayon sa aktuwal na kalagayan sa bukid, lokal na panahon, gamit na variety, iskedyul ng patubig, at payo ng lokal na agricultural personnel.',
  'Use the planner as a crop calendar guide, not a fixed farm order.':
    'Gamitin ang planner bilang gabay sa crop calendar, hindi bilang nakapirming utos sa sakahan.',
  'Review the schedule when planting conditions change.':
    'Suriin ang iskedyul kapag nagbago ang kondisyon ng pagtatanim.',
  'Edit saved activities locally when field needs differ from the estimate.':
    'I-edit ang mga naka-save na aktibidad kapag iba ang pangangailangan ng bukid kaysa sa tantiya.',
  'Clear rice photos may be checked online through the configured crop.health service.':
    'Maaaring masuri online ang malinaw na larawan ng palay sa naka-configure na crop.health service.',
  'Offline guide and planner content stay available without online scan support.':
    'Mananatiling available ang offline na gabay at planner kahit walang online scan support.',
  'Guide and planner wording are aligned with rice-focused agriculture references listed in References.':
    'Ang salita sa guide at planner ay nakaayon sa mga sangguniang pang-agrikultura na nasa References.',
  'What PALAYSCAN does': 'Ano ang ginagawa ng PALAYSCAN',
  'Main modules': 'Mga pangunahing bahagi',
  'Technology credits': 'Mga kredito sa teknolohiya',
  'Local-first records': 'Lokal na tala muna',
  'Scan. Guide. Plan.': 'Scan. Gabay. Plano.',
  'Rice support for field checking and estimated farm activities.':
    'Suporta sa palay para sa pagsusuri sa bukid at tantyang gawain sa sakahan.',
  Continue: 'Magpatuloy',
  'Open {section} guide section': 'Buksan ang gabay sa {section}',
  'Opens this guide section': 'Binubuksan ang seksyong ito ng gabay',
  'Planner reminder': 'Paalala ng planner',
  'Focused calendar. Tap to open full details.':
    'Naka-focus na calendar. Pindutin para buksan ang buong detalye.',
  'Tap to open this saved crop calendar.': 'Pindutin para buksan ang naka-save na crop calendar.',
  'Show all': 'Ipakita lahat',
  'Saved calendars': 'Naka-save na calendars',
  'Focused activities': 'Naka-focus na mga aktibidad',
  'Upcoming activities': 'Mga susunod na aktibidad',
  'Next activities': 'Mga susunod na gawain',
  'Recent calendars': 'Pinakabagong calendars',
  'Focused on Home': 'Naka-focus sa Tahanan',
  'Tap to focus': 'Pindutin para i-focus',
  'Tap a calendar to focus Home. Open details from the focused card.':
    'Pindutin ang calendar para i-focus ang Tahanan. Buksan ang detalye mula sa naka-focus na card.',
  'Tap an activity to open its saved calendar details.':
    'Pindutin ang aktibidad para buksan ang naka-save na detalye ng calendar.',
  'Use the Planner tab to create your first crop calendar.':
    'Gamitin ang Planner tab para gumawa ng una mong crop calendar.',
  'The current planner stays fully offline and uses local schedule rules only.':
    'Nanatiling offline ang planner at gumagamit lang ng lokal na panuntunan sa iskedyul.',
  'This scan result did not include a usable diagnosis match.':
    'Walang maayos na tugmang diagnosis ang scan result na ito.',
};

const additionalFilipinoTranslations: Record<string, string> = {
  'Find saved scans, crop calendars, privacy notes, and app references.':
    'Hanapin ang naka-save na scan, crop calendar, tala sa privacy, at mga sanggunian ng app.',
  '{count} palay varieties saved in this guide':
    '{count} variety ng palay ang naka-save sa gabay na ito',
  '{count} guide topics saved in this section':
    '{count} paksa ng gabay ang naka-save sa seksyong ito',
  'Search {category}': 'Hanapin sa {category}',
  '{count}/{max}': '{count}/{max}',
  '{count}/{max} photos ready. Add another angle if needed.':
    '{count}/{max} larawan ang handa. Magdagdag ng ibang anggulo kung kailangan.',
  'Analyze photos': 'Suriin ang mga larawan',
  'Analyze image': 'Suriin ang larawan',
  'this photo': 'larawang ito',
  'these photos': 'mga larawang ito',
  'This photo set was already analyzed. Add, replace, or retake a photo first.':
    'Nasuri na ang set ng larawang ito. Magdagdag, palitan, o kumuha muna ng bagong larawan.',
  'This image did not pass the pre-check. Please try another rice photo.':
    'Hindi pumasa sa paunang pagsusuri ang larawang ito. Subukan ang ibang larawan ng palay.',
  'This photo set was blocked by the local pre-check.':
    'Na-block ang set ng larawan sa paunang pagsusuri ng app.',
  'This scan result was not saved because it did not pass local validation.':
    'Hindi na-save ang resulta ng scan dahil hindi ito pumasa sa lokal na validation.',
  'The image could not be analyzed right now. Please try again.':
    'Hindi masuri ang larawan ngayon. Subukan muli.',
  'Type: {type}': 'Uri: {type}',
  'Plant appears healthy': 'Mukhang malusog ang halaman',
  'No major disease detected': 'Walang nakitang malaking sakit',
  'Strong match': 'Malakas ang tugma',
  'Check closely': 'Suriing mabuti',
  'Unclear match': 'Hindi malinaw ang tugma',
  Crop: 'Pananim',
  Scanned: 'Na-scan',
  Notes: 'Mga tala',
  Confidence: 'Tiwala sa tugma',
  'Issue type': 'Uri ng problema',
  Review: 'Suriin',
  Severity: 'Tindi',
  Spreading: 'Pagkalat',
  Taxonomy: 'Taxonomy',
  EPPO: 'EPPO',
  GBIF: 'GBIF',
  'Scan Detail': 'Detalye ng scan',
  'Back to scan': 'Bumalik sa scan',
  'No match details': 'Walang detalye ng tugma',
  'No detail text is available for this match yet.':
    'Wala pang detalye para sa tugmang ito.',
  'The photo match is strong. Still compare actual field signs before acting.':
    'Malakas ang tugma ng larawan. Ihambing pa rin sa aktuwal na palatandaan sa bukid bago kumilos.',
  'The result may help, but the field signs should be checked carefully.':
    'Makakatulong ang resulta, pero dapat pa ring suriin nang mabuti ang palatandaan sa bukid.',
  'Compare the photo with the field signs below.':
    'Ihambing ang larawan sa mga palatandaan sa bukid sa ibaba.',
  'Retake a clearer close photo if the field signs do not match.':
    'Kumuha muli ng mas malinaw at malapit na larawan kung hindi tugma ang palatandaan sa bukid.',
  'Retake a clearer photo or compare manually with the Guide.':
    'Kumuha muli ng mas malinaw na larawan o ihambing nang mano-mano sa Gabay.',
  'Compare manually with the Guide before deciding what to do.':
    'Ihambing muna nang mano-mano sa Gabay bago magpasya kung ano ang gagawin.',
  'Check nearby plants to see if the same signs are spreading.':
    'Suriin ang kalapit na mga halaman kung kumakalat ang parehong palatandaan.',
  'Ask a local agri technician when the problem is spreading fast.':
    'Magtanong sa lokal na agri technician kapag mabilis kumalat ang problema.',
  'Ask a local agri technician before using chemical control.':
    'Magtanong muna sa lokal na agri technician bago gumamit ng kemikal.',

  'Not set': 'Wala pa',
  Today: 'Ngayon',
  Tomorrow: 'Bukas',
  'In {days} days': 'Sa loob ng {days} araw',
  Complete: 'Tapos na',
  'No crop calendar yet': 'Wala pang crop calendar',
  'Create one in Planner to see your next farm activity here.':
    'Gumawa sa Planner para makita rito ang susunod na gawain sa bukid.',
  'Crop calendar completed': 'Tapos na ang crop calendar',
  'Last planting date: {date}': 'Huling petsa ng tanim: {date}',
  'Showing {shown} of {total}': 'Ipinapakita ang {shown} sa {total}',
  'Focused on {title}. Use Show all to return to every saved calendar.':
    'Naka-focus sa {title}. Gamitin ang Ipakita lahat para bumalik sa lahat ng naka-save na calendar.',
  'No upcoming planner activities yet.': 'Wala pang susunod na gawain sa planner.',
  'No saved crop calendars yet.': 'Wala pang naka-save na crop calendar.',
  'Planting date: {date}': 'Petsa ng tanim: {date}',
  '{count} activities': '{count} aktibidad',
  '{count} activities - {status}': '{count} aktibidad - {status}',
  'Guide, planner history, and saved scan records are organized for offline review.':
    'Nakaayos ang gabay, kasaysayan ng planner, at naka-save na scan para sa offline na pag-review.',

  'Planner Module': 'Modyul ng Planner',
  'Plan the next field work': 'Planuhin ang susunod na gawain sa bukid',
  'Set up your rice activity timeline': 'I-set up ang timeline ng gawain sa palay',
  'Create a local rice activity schedule from planting to harvest.':
    'Gumawa ng lokal na iskedyul ng gawain mula pagtatanim hanggang anihan.',
  'Choose planting method: Lipat-Tanim or Sabog-Tanim':
    'Piliin ang paraan ng pagtatanim: Lipat-Tanim o Sabog-Tanim',
  'Pick planting date': 'Pumili ng petsa ng tanim',
  'Generate a local rule-based activity schedule':
    'Gumawa ng lokal na iskedyul ng gawain batay sa panuntunan',
  'Prepare for editable dates and notes in later phases':
    'Maghanda para sa nae-edit na petsa at tala sa susunod na bahagi',
  'Build a rice crop calendar, check upcoming work, and keep saved activities ready for offline field review.':
    'Gumawa ng crop calendar ng palay, tingnan ang mga susunod na gawain, at panatilihing handa ang naka-save na aktibidad para sa offline na pag-review.',
  'Latest saved plan': 'Pinakabagong naka-save na plano',
  'Open latest calendar': 'Buksan ang pinakabagong calendar',
  'Open the latest saved crop calendar and update task status.':
    'Buksan ang pinakabagong naka-save na crop calendar at i-update ang status ng gawain.',
  'Crop plan setup': 'Setup ng plano ng tanim',
  'Start with the planting method used in the field.':
    'Magsimula sa paraan ng pagtatanim na ginamit sa bukid.',
  'Planting date': 'Petsa ng tanim',
  'This date becomes day 0 for the task timeline.':
    'Ang petsang ito ang magiging day 0 ng timeline ng gawain.',
  'Tap to change the planting date used for the schedule.':
    'Pindutin para palitan ang petsa ng tanim na gagamitin sa iskedyul.',
  'Rice variety duration': 'Tagal ng variety ng palay',
  'Adjust harvest timing based on the variety days to maturity.':
    'Iangkop ang oras ng anihan ayon sa araw ng variety hanggang paghinog.',
  Short: 'Maikli',
  Medium: 'Katamtaman',
  Long: 'Mahaba',
  Custom: 'Custom',
  '{days} days': '{days} araw',
  'Custom maturity days': 'Custom na araw hanggang paghinog',
  'Use {min}-{max} days. Harvest will move with this value.':
    'Gumamit ng {min}-{max} araw. Aayos ang anihan ayon sa halagang ito.',
  'Work plan included': 'Kasama ang work plan',
  'Land prep, seed prep, planting, fertilizer, water checks, scouting, and harvest.':
    'Paghahanda ng lupa, binhi, pagtatanim, abono, pagsusuri ng tubig, pagmamanman, at anihan.',
  'Dates are estimates. You can open the saved calendar later, mark tasks done, and adjust activity dates from planner history.':
    'Tantya lang ang mga petsa. Puwede mong buksan ang naka-save na calendar, markahan ang tapos na gawain, at baguhin ang petsa mula sa planner history.',
  'Generate and save an estimated local crop calendar.':
    'Gumawa at mag-save ng tantyang lokal na crop calendar.',
  'Generate calendar': 'Gumawa ng calendar',
  Selected: 'Napili',
  Choose: 'Piliin',
  'This method is selected': 'Napili ang paraang ito',
  'Tap card to select method': 'Pindutin ang card para pumili ng paraan',
  Transplanting: 'Lipat-tanim',
  'Direct Seeding': 'Sabog-tanim',
  'Short variety': 'Maikling variety',
  'Medium variety': 'Katamtamang variety',
  'Long variety': 'Mahabang variety',
  'Custom {days}-day variety': 'Custom na {days}-araw na variety',

  'Planner dashboard': 'Dashboard ng planner',
  'Saved planner progress': 'Naka-save na progreso ng planner',
  '1 task needs attention before the next field work.':
    'May 1 gawain na kailangang asikasuhin bago ang susunod na trabaho sa bukid.',
  '{count} tasks need attention before the next field work.':
    'May {count} gawain na kailangang asikasuhin bago ang susunod na trabaho sa bukid.',
  '1 task is ready to check today.': 'May 1 gawain na handang suriin ngayon.',
  '{count} tasks are ready to check today.':
    'May {count} gawain na handang suriin ngayon.',
  Done: 'Tapos',
  Due: 'Dapat gawin',
  Late: 'Huli',
  'Done early': 'Maagang natapos',
  'Due now': 'Dapat gawin ngayon',
  Upcoming: 'Paparating',
  'Variety Duration': 'Tagal ng Variety',
  'Stage follows crop age.': 'Sumusunod ang yugto sa edad ng palay.',
  'Checked tasks update work progress only.':
    'Ang naka-check na gawain ay progreso lang ang ina-update.',
  Land: 'Lupa',
  Seed: 'Binhi',
  Nursery: 'Punlaan',
  Planting: 'Pagtatanim',
  Fertilizer: 'Abono',
  Water: 'Tubig',
  Scout: 'Mamanman',
  Harvest: 'Anihan',
  Prepare: 'Paghahanda',
  Plant: 'Tanim',
  Tillering: 'Pagsusuwi',
  Panicle: 'Paglabas ng uhay',
  Ripening: 'Paghinog',
  Planning: 'Pagpaplano',
  'Land and seed': 'Lupa at binhi',
  'Day 0': 'Day 0',
  'Scout and feed': 'Magmanman at mag-abono',
  'Water and monitor': 'Tubig at pagmamanman',
  'Planting in {days} days': 'Pagtatanim sa loob ng {days} araw',
  '{days} days left': '{days} araw ang natitira',
  'Land preparation starts around {date}.':
    'Magsisimula ang paghahanda ng lupa bandang {date}.',
  '{days} days before planting': '{days} araw bago magtanim',
  'Day {day}': 'Day {day}',
  'Land and seed preparation window.': 'Panahon ng paghahanda ng lupa at binhi.',
  'Day 0 - Planting': 'Day 0 - Pagtatanim',
  'Planting date starts the crop calendar.':
    'Ang petsa ng tanim ang simula ng crop calendar.',
  'Calendar completed': 'Tapos na ang calendar',
  'Review harvest records and start a new plan when needed.':
    'Suriin ang tala ng anihan at gumawa ng bagong plano kung kailangan.',
  'Day {day} - {stage}': 'Day {day} - {stage}',
  'Crop Stage': 'Yugto ng palay',
  'Crop stage changes by planting date and variety duration. Task checkmarks do not move the growth stage.':
    'Nagbabago ang yugto ng palay ayon sa petsa ng tanim at tagal ng variety. Hindi ginagalaw ng checkmark ng gawain ang yugto ng paglaki.',
  'Estimated Crop Calendar': 'Tantyang Crop Calendar',
  'Crop Calendar': 'Crop Calendar',
  '{method} Calendar': 'Calendar ng {method}',
  'Rice Crop Calendar': 'Crop Calendar ng Palay',
  'Variety duration: {duration}': 'Tagal ng variety: {duration}',
  'Field task checklist': 'Checklist ng gawain sa bukid',
  'Mark work as done when finished. Saved calendars keep this progress locally for offline review.':
    'Markahan ang gawain kapag tapos na. Itinatago ng naka-save na calendar ang progreso sa device para sa offline na review.',
  'Calendar Summary': 'Buod ng Calendar',
  'View the estimated crop timeline by month and tap a date to see planned activities.':
    'Tingnan ang tantyang timeline kada buwan at pindutin ang petsa para makita ang planong gawain.',
  Sun: 'Ling',
  Mon: 'Lun',
  Tue: 'Mar',
  Wed: 'Miy',
  Thu: 'Huw',
  Fri: 'Biy',
  Sat: 'Sab',
  'Activities on {date}': 'Mga gawain sa {date}',
  '{count} activities are scheduled on this date.':
    '{count} aktibidad ang naka-iskedyul sa petsang ito.',
  'No scheduled activity falls on this date in the current crop calendar view.':
    'Walang naka-iskedyul na gawain sa petsang ito sa kasalukuyang crop calendar.',
  'Back to Planner': 'Bumalik sa Planner',
  'Saved Crop Calendar': 'Naka-save na Crop Calendar',
  'Method: {method}': 'Paraan: {method}',
  'Saved: {date}': 'Na-save: {date}',
  'Edit selected activity': 'I-edit ang napiling aktibidad',
  'Update the date or notes for this saved activity. Changes stay on this device and refresh the crop calendar below.':
    'I-update ang petsa o tala ng naka-save na aktibidad na ito. Mananatili sa device ang pagbabago at mare-refresh ang crop calendar sa ibaba.',
  'Current window: {window}': 'Kasalukuyang panahon: {window}',
  'Tap to adjust this activity date. Multi-day windows move together.':
    'Pindutin para baguhin ang petsa ng aktibidad. Sabay na gagalaw ang multi-day window.',
  'Activity notes': 'Tala ng aktibidad',
  'Activity Notes': 'Tala ng aktibidad',
  'Add one note per line for this saved activity.':
    'Maglagay ng isang tala bawat linya para sa naka-save na aktibidad.',
  'Save this date and note update to local planner history.':
    'I-save ang petsa at tala sa lokal na planner history.',
  'Saving changes...': 'Sine-save ang pagbabago...',
  'Save activity changes': 'I-save ang pagbabago sa aktibidad',
  'Tap an activity from the calendar or the list below to edit its saved date and notes.':
    'Pindutin ang aktibidad mula sa calendar o listahan sa ibaba para i-edit ang naka-save na petsa at tala.',
  'Remove this saved planner record from local history.':
    'Tanggalin ang naka-save na planner record mula sa lokal na history.',
  'Delete this planner record': 'Burahin ang planner record na ito',
  'Delete planner record': 'Burahin ang planner record',
  'Remove this saved planner schedule from local history?':
    'Tanggalin ang naka-save na planner schedule mula sa lokal na history?',
  'Planner record not found': 'Hindi nakita ang planner record',
  'This saved planner schedule could not be loaded from local history.':
    'Hindi ma-load ang naka-save na planner schedule mula sa lokal na history.',
  'Activity updated': 'Na-update ang aktibidad',
  'This saved crop calendar activity was updated locally.':
    'Na-update sa device ang aktibidad ng naka-save na crop calendar.',
  'Logged before the planned window. The crop stage still follows the calendar date.':
    'Na-log bago ang planong panahon. Susunod pa rin ang yugto ng palay sa petsa ng calendar.',
  'Hide activity notes': 'Itago ang tala ng aktibidad',
  'Show activity notes': 'Ipakita ang tala ng aktibidad',
  'Mark task done': 'Markahan na tapos',
  'Mark task not done': 'Markahan na hindi pa tapos',

  'History Module': 'Modyul ng History',
  'Review your saved records': 'Suriin ang mga naka-save na tala',
  'Review saved scan and planner records stored locally on this device.':
    'Suriin ang naka-save na scan at planner record na nasa device na ito.',
  'Scans ({count})': 'Mga scan ({count})',
  'Calendars ({count})': 'Mga calendar ({count})',
  'Scan History': 'Kasaysayan ng Scan',
  'Planner History': 'Kasaysayan ng Planner',
  'Saved image checks, top result, confidence scores, and optional farmer notes.':
    'Naka-save na pagsusuri ng larawan, pangunahing resulta, confidence score, at opsyonal na tala ng magsasaka.',
  'Clear scan history': 'Linisin ang scan history',
  'Clear all': 'Linisin lahat',
  'Remove all saved scan records from local history.':
    'Tanggalin ang lahat ng naka-save na scan record mula sa lokal na history.',
  'Remove all saved scan records from this device?':
    'Tanggalin ang lahat ng naka-save na scan record mula sa device na ito?',
  'Non-Plant Image': 'Hindi larawan ng halaman',
  'Saved local crop calendars are listed here for offline review.':
    'Nakalista rito ang naka-save na crop calendar para sa offline na review.',
  'Saved locally: {date}': 'Na-save sa device: {date}',
  'Tap card to view calendar': 'Pindutin ang card para makita ang calendar',
  'Tap card to view details': 'Pindutin ang card para makita ang detalye',
  'Confidence: {confidence}': 'Tiwala sa tugma: {confidence}',
  'Scanned: {date}': 'Na-scan: {date}',
  'Delete this scan': 'Burahin ang scan na ito',
  'Remove this saved scan from local history.':
    'Tanggalin ang naka-save na scan mula sa lokal na history.',
  'Deleting...': 'Binubura...',
  'Scan History Detail': 'Detalye ng scan history',
  'Scan Result Detail': 'Detalye ng resulta ng scan',
  'Planner History Detail': 'Detalye ng planner history',

  'Farmer support for scan, guide, and crop calendar use':
    'Suporta sa magsasaka para sa scan, gabay, at crop calendar',
  'PALAYSCAN is a rice-focused mobile app that combines image-based crop issue guidance, an offline guide module, and an estimated crop calendar for local field planning.':
    'Ang PALAYSCAN ay mobile app para sa palay na pinagsasama ang gabay mula sa larawan, offline na gabay, at tantyang crop calendar para sa lokal na pagpaplano sa bukid.',
  'The app is designed to help users review rice-related guide content, check possible crop issues from images, and organize planting-to-harvest activities in a simple mobile workflow.':
    'Dinisenyo ang app para makatulong sa pag-review ng gabay sa palay, pag-check ng posibleng problema mula sa larawan, at pag-aayos ng gawain mula tanim hanggang ani sa simpleng mobile workflow.',
  'The app is organized around the main tasks that a farmer or field user is most likely to open first.':
    'Inayos ang app ayon sa pangunahing gawain na madalas unang buksan ng magsasaka o field user.',
  'Guide: local palay varieties, pests, and diseases for offline browsing.':
    'Gabay: lokal na variety ng palay, peste, at sakit para sa offline na pagbasa.',
  'Scan: image-based checking flow with guide-only result messaging and history.':
    'Scan: pagsusuri gamit ang larawan, resultang pang-gabay lamang, at history.',
  'Planner: an estimated crop calendar based on planting method and planting date.':
    'Planner: tantyang crop calendar batay sa paraan at petsa ng pagtatanim.',
  'History: local review of saved scan and planner records.':
    'History: lokal na review ng naka-save na scan at planner records.',
  'Image checking can use the configured Kindwise crop.health service when online scan support is enabled. PALAYSCAN still presents those outputs as guide-only support and does not show or store the service key in the app interface.':
    'Maaaring gumamit ng naka-configure na Kindwise crop.health service ang image checking kapag naka-on ang online scan support. Ipinapakita pa rin ito ng PALAYSCAN bilang gabay lamang at hindi ipinapakita o sine-save ang service key sa app interface.',
  'Scan service credit: Kindwise crop.health.': 'Credit sa scan service: Kindwise crop.health.',
  'Project team': 'Pangkat ng proyekto',
  'Project proponents': 'Mga proponent ng proyekto',
  'Project proponent': 'Project proponent',
  'Project Developer': 'Project Developer',
  Developer: 'Developer',
  'App design, mobile implementation, scan workflow integration, and field workflow testing.':
    'Disenyo ng app, mobile implementation, scan workflow integration, at field workflow testing.',

  'A scan result may depend on image quality, lighting, angle, crop stage, and whether the photo clearly shows a rice leaf, stem, or field condition.':
    'Maaaring maapektuhan ang resulta ng scan ng linaw ng larawan, ilaw, anggulo, yugto ng palay, at kung malinaw na nakikita ang dahon, tangkay, o kondisyon ng bukid.',
  'Users should compare scan output with visible field symptoms and, when needed, verify findings with local agricultural references or an agricultural technician.':
    'Ihambing ng user ang scan output sa nakikitang sintomas sa bukid at, kung kailangan, ipa-verify sa lokal na sanggunian sa agrikultura o agricultural technician.',
  'Treat the best match and top matches as guides only.':
    'Ituring ang best match at top matches bilang gabay lamang.',
  'Use clearer rice images for better checking.':
    'Gumamit ng mas malinaw na larawan ng palay para mas maayos ang pagsusuri.',
  'Do not rely on scan output alone for major farm decisions.':
    'Huwag umasa sa scan output lamang para sa malalaking desisyon sa sakahan.',
  'The app may block, warn, or avoid saving unrelated images to help protect scan quality and prevent misleading records.':
    'Maaaring i-block, magbigay-babala, o hindi i-save ng app ang hindi kaugnay na larawan para mapanatili ang kalidad ng scan at maiwasan ang maling tala.',
  'Online scan support': 'Online scan support',
  'When online image checking is enabled, PALAYSCAN may send approved rice photos to the configured Kindwise crop.health service for image-based checking. The scan result should still be treated as guide-only.':
    'Kapag naka-on ang online image checking, maaaring ipadala ng PALAYSCAN ang aprubadong larawan ng palay sa naka-configure na Kindwise crop.health service. Gabay lamang pa rin ang resulta ng scan.',
  'Do not include faces, personal documents, or unrelated objects in scan photos.':
    'Huwag isama ang mukha, personal na dokumento, o hindi kaugnay na bagay sa scan photos.',
  'The API key is configuration data and should not be shown to regular app users.':
    'Ang API key ay configuration data at hindi dapat ipakita sa regular na users.',
  'Saved scan history and planner history are stored locally on the device so the user can review records later without needing a backend account.':
    'Ang scan history at planner history ay naka-store locally sa device para ma-review ng user kahit walang backend account.',
  'Planner records are saved locally for offline review and editing.':
    'Naka-save locally ang planner records para sa offline review at pag-edit.',
  'Saved scan history is stored locally on the device.':
    'Naka-store locally sa device ang scan history.',
  'Users can remove saved records from local history inside the app.':
    'Maaaring tanggalin ng user ang naka-save na records mula sa local history sa app.',
  'Users should avoid uploading personal, unrelated, or sensitive images. PALAYSCAN is intended for clear rice leaf, stem, or field photos only.':
    'Iwasang mag-upload ng personal, hindi kaugnay, o sensitibong larawan. Para lamang ang PALAYSCAN sa malinaw na larawan ng dahon, tangkay, o bukid ng palay.',

  'References and Basis': 'Mga Sanggunian at Batayan',
  'Basis used for guide and crop calendar content':
    'Batayan ng nilalaman ng gabay at crop calendar',
  'Guide module basis': 'Batayan ng Guide module',
  'The Guide module content was reviewed and written using rice-focused references for varieties, pests, and diseases.':
    'Sinuri at isinulat ang Guide module gamit ang mga sanggunian sa palay para sa varieties, peste, at sakit.',
  'PinoyRice Knowledge Bank rice varieties information.':
    'Impormasyon sa rice varieties mula sa PinoyRice Knowledge Bank.',
  'PhilRice rice variety and crop management materials.':
    'Mga materyal ng PhilRice sa rice variety at crop management.',
  'IRRI Rice Knowledge Bank pest and disease references.':
    'Mga sanggunian ng IRRI Rice Knowledge Bank sa peste at sakit.',
  'Planner / crop calendar basis': 'Batayan ng Planner / crop calendar',
  'The Planner module follows a planting-to-harvest crop calendar structure based on broad rice management stages rather than exact prescription dates.':
    'Ang Planner module ay sumusunod sa planting-to-harvest crop calendar batay sa malalawak na yugto ng rice management, hindi sa eksaktong petsang reseta.',
  'PinoyRice PalayCheck crop management guidance.':
    'Gabay sa crop management mula sa PinoyRice PalayCheck.',
  'IRRI Rice Knowledge Bank step-by-step rice production references.':
    'Step-by-step rice production references mula sa IRRI Rice Knowledge Bank.',
  'Rice crop-stage practices such as land preparation, crop establishment, water management, pest monitoring, and harvest timing.':
    'Mga gawain ayon sa yugto ng palay tulad ng paghahanda ng lupa, crop establishment, water management, pest monitoring, at timing ng anihan.',
  'Guide image credits': 'Credits ng larawan sa Gabay',
  'Some Guide visuals are local copies from reusable Wikimedia Commons, Bugwood, and open-access research pages. When exact reusable variety photos were not verified, PALAYSCAN uses real rice reference photos without claiming they show the exact NSIC variety.':
    'Ang ilang larawan sa Gabay ay lokal na kopya mula sa reusable Wikimedia Commons, Bugwood, at open-access research pages. Kapag hindi na-verify ang eksaktong reusable variety photo, gumagamit ang PALAYSCAN ng totoong rice reference photo nang hindi sinasabing iyon ang eksaktong NSIC variety.',
  'Disease visuals added for Rice Blast, Bacterial Leaf Blight, Sheath Blight, Brown Spot, False Smut, Tungro, Bacterial Leaf Streak, Bakanae, Sheath Rot, Stem Rot, Narrow Brown Spot, Leaf Scald, Red Stripe, Rice Grassy Stunt, and Rice Ragged Stunt.':
    'Nagdagdag ng larawan para sa Rice Blast, Bacterial Leaf Blight, Sheath Blight, Brown Spot, False Smut, Tungro, Bacterial Leaf Streak, Bakanae, Sheath Rot, Stem Rot, Narrow Brown Spot, Leaf Scald, Red Stripe, Rice Grassy Stunt, at Rice Ragged Stunt.',
  'Pest visuals added for Brown Planthopper, Rice Black Bug, Stem Borer, Rice Leaffolder, Golden Apple Snail, Rice Bug, Green Leafhopper, Whitebacked Planthopper, Rice Whorl Maggot, Rice Caseworm, Rice Gall Midge, Rice Hispa, Rice Thrips, Armyworm, and Cutworm.':
    'Nagdagdag ng larawan para sa Brown Planthopper, Rice Black Bug, Stem Borer, Rice Leaffolder, Golden Apple Snail, Rice Bug, Green Leafhopper, Whitebacked Planthopper, Rice Whorl Maggot, Rice Caseworm, Rice Gall Midge, Rice Hispa, Rice Thrips, Armyworm, at Cutworm.',
  'Rice variety visuals use real rice reference photos from Wikimedia Commons and local crops of those photos. They are not exact NSIC variety photos and can be replaced later with team-owned or otherwise authorized variety photos.':
    'Ang larawan ng rice varieties ay gumagamit ng totoong rice reference photos mula sa Wikimedia Commons at lokal na crops ng mga larawang iyon. Hindi ito eksaktong NSIC variety photos at puwedeng palitan kalaunan ng team-owned o authorized na variety photos.',
  'Important use note': 'Mahalagang paalala sa paggamit',
  'These references support the app\'s local content structure and wording. Actual farm practice should still consider local season, variety, irrigation, soil condition, and advice from local agricultural personnel.':
    'Sinusuportahan ng mga sangguniang ito ang lokal na nilalaman at wording ng app. Sa aktuwal na sakahan, isaalang-alang pa rin ang lokal na panahon, variety, patubig, kondisyon ng lupa, at payo ng local agricultural personnel.',

  'View guide details': 'Tingnan ang detalye ng gabay',
  'Tap to zoom': 'Pindutin para i-zoom',
  'Opens this guide image in a larger viewer': 'Binubuksan ang larawan sa mas malaking viewer',
  'Open {title} image': 'Buksan ang larawan ng {title}',
  'Close image viewer': 'Isara ang image viewer',
  'Use + or - to zoom. Drag when zoomed.': 'Gamitin ang + o - para mag-zoom. I-drag kapag naka-zoom.',
  '{title} guide image': 'Larawan ng gabay para sa {title}',
  'Set zoom to {zoom} times': 'Itakda ang zoom sa {zoom} beses',
  'Zoom out': 'Zoom out',
  'Zoom in': 'Zoom in',
  'Reset image zoom': 'I-reset ang zoom ng larawan',
  Reset: 'Reset',
  'Palay variety': 'Variety ng palay',
  'Palay Variety': 'Variety ng Palay',
  Pest: 'Peste',
  Disease: 'Sakit',
  'Pest photo': 'Larawan ng peste',
  'Disease photo': 'Larawan ng sakit',
  'Reference palay photo only. Use the facts below for this variety.':
    'Larawang sanggunian ng palay lamang. Gamitin ang facts sa ibaba para sa variety na ito.',
  'Reference palay photo only. Use the guide facts for this variety.':
    'Larawang sanggunian ng palay lamang. Gamitin ang guide facts para sa variety na ito.',
  'Quick facts': 'Mabilis na facts',
  'Compare these before choosing seed for your field.':
    'Ihambing muna ang mga ito bago pumili ng binhi para sa bukid.',
  'Days to harvest': 'Araw hanggang anihan',
  'Possible yield': 'Posibleng ani',
  Grain: 'Butil',
  'Best field': 'Pinakaangkop na bukid',
  'What this means': 'Ano ang ibig sabihin nito',
  'Plain guide note for this variety.': 'Simpleng tala ng gabay para sa variety na ito.',
  'Why farmers check it': 'Bakit ito tinitingnan ng magsasaka',
  'Check before planting': 'Suriin bago magtanim',
  'Jump to {label}': 'Pumunta sa {label}',
  'What to see': 'Ano ang makikita',
  'What to do': 'Ano ang gagawin',
  'Avoid it': 'Iwasan ito',
  'Tap the image to zoom, then compare with the field signs below.':
    'Pindutin ang larawan para i-zoom, tapos ihambing sa mga palatandaan sa bukid sa ibaba.',
  'Use the photo as a visual guide only. Check the actual plant signs in your field.':
    'Gamitin ang larawan bilang visual guide lamang. Suriin pa rin ang aktuwal na palatandaan sa bukid.',
  'Jump to what you need': 'Pumunta sa kailangan mo',
  'Go straight to signs, field action, or prevention.':
    'Diretso sa palatandaan, aksyon sa bukid, o pag-iwas.',
  'Compare these first with the leaves, stem, panicle, or field patch.':
    'Ihambing muna ang mga ito sa dahon, tangkay, uhay, o bahagi ng bukid.',
  'Where to look': 'Saan titingin',
  'Compare with actual field signs before making farm decisions.':
    'Ihambing sa aktuwal na palatandaan sa bukid bago magdesisyon sa sakahan.',
  'Entry not found': 'Hindi nakita ang entry',
  'This local guide entry could not be found.':
    'Hindi nakita ang lokal na guide entry na ito.',
};

const farmerFilipinoTranslations: Record<string, string> = {
  Home: 'Home',
  Guide: 'Gabay',
  Scan: 'Scan',
  Planner: 'Kalendaryo',
  More: 'Iba pa',
  History: 'History',
  'Records and Help': 'Mga tala at tulong',
  'Saved Records': 'Mga naka-save',
  'Safety and Privacy': 'Kaligtasan at privacy',
  'Language / Wika': 'Wika ng app',
  'Choose your app language.': 'Piliin kung English o Filipino ang lalabas sa app.',
  'Choose the language used in the app.':
    'Piliin ang wikang gagamitin sa app.',
  'Device code': 'Code ng device',
  'Use this code when requesting more scans.':
    'Ipadala ang code na ito kung kailangan pa ng dagdag na scan.',
  'Loading code': 'Kinukuha ang code',
  'Current app language': 'Wika ngayon',
  'Open the app in English or Filipino.': 'Puwedeng English o Filipino ang app.',
  'App language': 'Wika ng app',
  Continue: 'Magpatuloy',

  'Guide Module': 'Gabay sa Palay',
  'Palay field guide': 'Gabay sa palayan',
  'Browse palay varieties, pests, and diseases with clear notes and field reference photos.':
    'Tingnan ang mga variety, peste, at sakit ng palay. May simpleng tala at larawan para ikumpara sa bukid.',
  'Palay Varieties': 'Mga Variety ng Palay',
  Varieties: 'Variety',
  Pests: 'Mga peste',
  Diseases: 'Mga sakit',
  'Open {section} guide section': 'Buksan ang gabay sa {section}',
  'Opens this guide section': 'Binubuksan ang seksyong ito ng gabay',
  'Browse palay varieties': 'Tingnan ang variety ng palay',
  'Browse pests': 'Tingnan ang mga peste',
  'Browse diseases': 'Tingnan ang mga sakit',
  'Search': 'Hanapin',
  entries: 'tala',
  'entries saved': 'naka-save na tala',
  'No matching entries found': 'Walang nakita',
  'Try another keyword or clear the search to see the full offline guide list.':
    'Subukan ang ibang salita o alisin ang hinahanap para makita ang buong listahan.',
  'Back to Guide': 'Balik sa Gabay',
  'Back to list': 'Balik sa listahan',
  'View guide details': 'Tingnan ang detalye',
  'Tap to zoom': 'Pindutin para palakihin',
  'Use + or - to zoom. Drag when zoomed.':
    'Pindutin ang + o - para palakihin o liitan. I-drag kapag naka-zoom.',
  'Reference palay photo only. Use the facts below for this variety.':
    'Larawan lang ito ng palay bilang gabay. Sundin ang facts sa ibaba para sa variety na ito.',
  'Reference palay photo only. Use the guide facts for this variety.':
    'Larawan lang ito ng palay bilang gabay. Gamitin ang guide facts para sa variety na ito.',
  'Compare with actual field signs before making farm decisions.':
    'Ikumpara muna sa aktuwal na palatandaan sa bukid bago magdesisyon.',
  'Quick facts': 'Mabilisang info',
  'Compare these before choosing seed for your field.':
    'Ikumpara muna ito bago pumili ng binhi para sa bukid.',
  'Days to harvest': 'Araw bago anihin',
  'Possible yield': 'Posibleng ani',
  Grain: 'Butil',
  'Best field': 'Bagay na bukid',
  'What this means': 'Ibig sabihin nito',
  'Plain guide note for this variety.': 'Simpleng paliwanag para sa variety na ito.',
  'Why farmers check it': 'Bakit ito tinitingnan',
  'Check before planting': 'I-check bago magtanim',
  'What to see': 'Ano ang makikita',
  'What to do': 'Ano ang gagawin',
  'Avoid it': 'Paano iiwasan',
  'What you may see': 'Makikita sa palay',
  'Compare these first with the leaves, stem, panicle, or field patch.':
    'Ikumpara muna ito sa dahon, tangkay, uhay, o bahagi ng palayan.',
  'Where to look': 'Saan titingin',
  'Damage or signs': 'Pinsala o palatandaan',
  'How to avoid it': 'Paano maiwasan',
  'Scientific Name': 'Scientific name',
  'Jump to what you need': 'Piliin ang kailangan mo',
  'Go straight to signs, field action, or prevention.':
    'Diretso sa palatandaan, gagawin sa bukid, o pag-iwas.',

  'Scan Module': 'Scan ng Palay',
  'Scan a rice problem': 'I-scan ang problema sa palay',
  'Capture or upload rice photos, then review the photo focus before analysis.':
    'Kunan o i-upload ang larawan ng palay, tapos i-check muna kung malinaw bago i-scan.',
  'Start field scan': 'Simulan ang scan',
  'Use close, bright rice photos for better scan results.':
    'Mas maganda ang resulta kapag malapit, maliwanag, at malinaw ang larawan ng palay.',
  Capture: 'Kunan',
  Upload: 'Mag-upload',
  'Open camera': 'Buksan ang camera',
  'Pick photo': 'Pumili ng larawan',
  'Photo focus': 'Linaw ng larawan',
  'Selected photos': 'Napiling larawan',
  'Checking photos': 'Tinitingnan ang larawan',
  'Matching issue': 'Hinahanap ang posibleng problema',
  'Preparing result': 'Inihahanda ang resulta',
  'Analyzing photos': 'Sine-scan ang larawan',
  'Checking the rice photos and preparing a possible issue result.':
    'Sine-check ang larawan ng palay at inihahanda ang posibleng resulta.',
  'Add at least one rice photo before analyzing.':
    'Magdagdag muna ng kahit isang larawan ng palay.',
  'Confirm that the selected photos show the same rice problem before analyzing.':
    'Siguraduhing iisang problema sa palay ang nasa mga larawan bago i-scan.',
  'Analysis is already in progress. Please wait for it to finish.':
    'Kasalukuyang nag-scan. Hintayin munang matapos.',
  'Analyze {subject}.': 'I-scan ang {subject}.',
  'Analyze in {seconds}s': 'I-scan sa {seconds}s',
  'Analyze photos': 'I-scan ang mga larawan',
  'Analyze image': 'I-scan ang larawan',
  'this photo': 'larawang ito',
  'these photos': 'mga larawang ito',
  'Camera permission needed': 'Kailangan ang pahintulot sa camera',
  'Please allow camera access so you can capture a rice image for scanning.':
    'Payagan ang camera para makakuha ng larawan ng palay.',
  'Gallery permission needed': 'Kailangan ang pahintulot sa gallery',
  'Please allow photo library access so you can choose a rice image to scan.':
    'Payagan ang photo library para makapili ng larawang i-scan.',
  Retake: 'Ulitin',
  Replace: 'Palitan',
  'Optional notes': 'Dagdag na tala',
  'Add short notes for this scan result later if needed.':
    'Maglagay ng maikling tala kung kailangan.',
  'I confirm these are clear rice leaf, stem, panicle, or field photos.':
    'Malinaw na larawan ito ng dahon, tangkay, uhay, o bahagi ng palayan.',
  'These photos show the same rice problem from different angles.':
    'Iisang problema sa palay ang nasa mga larawang ito.',
  Ready: 'Handa',
  'Best photo set': 'Pinakamalinaw na set',
  'Aim at the affected leaf, stem, panicle, or field patch.':
    'Itutok sa apektadong dahon, tangkay, uhay, o bahagi ng palayan.',
  'Scan could not be completed': 'Hindi natuloy ang scan',
  'The scan could not be completed. Check your connection and image, then try again.':
    'Hindi natuloy ang scan. I-check ang internet at larawan, tapos subukan ulit.',
  'No usable matches found': 'Walang malinaw na tugma',
  'The scan finished, but there were not enough usable matches to show a result. Try a clearer image.':
    'Natapos ang scan pero kulang ang malinaw na tugma. Subukan ang mas malinaw na larawan.',
  'Scan result': 'Resulta ng scan',
  'Review the possible issue and compare the field signs.':
    'Tingnan ang posibleng problema at ikumpara sa palatandaan sa bukid.',
  'Possible issue': 'Posibleng problema',
  'Non-plant image detected': 'Mukhang hindi halaman ang larawan',
  'Tap to check signs and next steps': 'Pindutin para makita ang palatandaan at gagawin',
  'Rice check warning': 'Paalala sa scan',
  'Use this as a guide only. Check the field signs or ask your local agriculture office if needed.':
    'Gabay lang ito. I-check pa rin sa bukid o magtanong sa local agriculture office kung kailangan.',
  'Other possible matches': 'Iba pang posibleng tugma',
  'Possible Scan Issue': 'Posibleng Problema',
  'Next steps': 'Susunod na gagawin',
  'Use the scan as a guide, then check the field.':
    'Gamitin ang scan bilang gabay, tapos i-check sa bukid.',
  'Photos used for scan': 'Larawang ginamit sa scan',
  'Tap another match if the field signs look closer to it.':
    'Pindutin ang ibang tugma kung mas hawig sa nakikita sa bukid.',
  'About this possible issue': 'Tungkol sa posibleng problema',
  'What to do next': 'Ano ang puwedeng gawin',
  'Reference details': 'Detalye ng sanggunian',
  Confidence: 'Gaano kasigurado',
  'Issue type': 'Uri ng problema',
  'Strong match': 'Mukhang tugma',
  'Check closely': 'I-check pa sa bukid',
  'Unclear match': 'Hindi pa sigurado',
  'Plant appears healthy': 'Mukhang maayos ang palay',
  'No major disease detected': 'Walang malaking sakit na nakita',
  'The photo match is strong. Still compare actual field signs before acting.':
    'Mukhang tugma ang larawan. Ikumpara pa rin sa aktuwal na palatandaan bago kumilos.',
  'The result may help, but the field signs should be checked carefully.':
    'Makakatulong ang resulta, pero i-check pa rin nang mabuti sa bukid.',
  'Retake a clearer close photo if the field signs do not match.':
    'Kumuha ulit ng mas malinaw at malapit na larawan kung hindi tugma sa bukid.',
  'Ask a local agri technician when the problem is spreading fast.':
    'Magtanong sa local agri technician kung mabilis kumalat ang problema.',

  'Planner Module': 'Kalendaryo ng Palay',
  'Plan the next field work': 'Planuhin ang susunod na trabaho sa palayan',
  'Build a rice crop calendar, check upcoming work, and keep saved activities ready for offline field review.':
    'Gumawa ng kalendaryo ng palay, tingnan ang susunod na gawain, at i-save para mabuksan kahit offline.',
  'Latest saved plan': 'Huling naka-save na kalendaryo',
  'Open latest calendar': 'Buksan ang huling kalendaryo',
  'Open the latest saved crop calendar and update task status.':
    'Buksan ang huling kalendaryo at markahan ang tapos na gawain.',
  'Crop plan setup': 'Simula ng plano',
  'Start with the planting method used in the field.':
    'Piliin muna ang paraan ng pagtatanim sa bukid.',
  'Planting date': 'Petsa ng tanim',
  'This date becomes day 0 for the task timeline.':
    'Ito ang magiging Day 0 ng kalendaryo.',
  'Tap to change the planting date used for the schedule.':
    'Pindutin para palitan ang petsa ng tanim.',
  'Rice variety duration': 'Haba ng variety',
  'Adjust harvest timing based on the variety days to maturity.':
    'Aayusin nito ang tantiya ng anihan base sa haba ng variety.',
  Short: 'Maikli',
  Medium: 'Katamtaman',
  Long: 'Mahaba',
  Custom: 'Sariling bilang',
  '{days} days': '{days} araw',
  'Custom maturity days': 'Sariling bilang ng araw',
  'Use {min}-{max} days. Harvest will move with this value.':
    'Gumamit ng {min}-{max} araw. Dito ibabase ang tantiya ng anihan.',
  'Work plan included': 'Kasamang gawain',
  'Land prep, seed prep, planting, fertilizer, water checks, scouting, and harvest.':
    'Paghahanda ng lupa, binhi, tanim, pataba, tubig, pagmamanman, at anihan.',
  'Dates are estimates. You can open the saved calendar later, mark tasks done, and adjust activity dates from planner history.':
    'Tantya lang ang petsa. Puwede itong buksan ulit, markahan ang tapos, at baguhin sa history.',
  'Generate calendar': 'Gumawa ng kalendaryo',
  Selected: 'Napili',
  Choose: 'Piliin',
  'This method is selected': 'Ito ang napiling paraan',
  'Tap card to select method': 'Pindutin para piliin',
  'Planner dashboard': 'Buod ng kalendaryo',
  'Saved planner progress': 'Progreso ng kalendaryo',
  Done: 'Tapos na',
  Due: 'Gawin ngayon',
  Late: 'Naantala',
  Upcoming: 'Paparating',
  'Done early': 'Maagang natapos',
  'Due now': 'Gawin ngayon',
  'Variety Duration': 'Haba ng variety',
  'Stage follows crop age.': 'Ang yugto ay sumusunod sa edad ng palay.',
  'Checked tasks update work progress only.':
    'Ang checkmark ay para lang sa progreso ng gawain.',
  Land: 'Lupa',
  Seed: 'Binhi',
  Nursery: 'Punlaan',
  Planting: 'Tanim',
  Fertilizer: 'Pataba',
  Water: 'Tubig',
  Scout: 'Manman',
  Harvest: 'Anihan',
  Prepare: 'Paghahanda',
  Plant: 'Tanim',
  Tillering: 'Pagsusuwi',
  Panicle: 'Pag-uuhay',
  Ripening: 'Paghinog',
  Planning: 'Pagpaplano',
  'Scout and feed': 'Magmanman at magpataba',
  'Water and monitor': 'Tubig at bantay',
  'Planting in {days} days': 'Tanim sa loob ng {days} araw',
  '{days} days left': '{days} araw pa',
  'Land preparation starts around {date}.':
    'Simulan ang paghahanda ng lupa bandang {date}.',
  '{days} days before planting': '{days} araw bago magtanim',
  'Land and seed preparation window.': 'Panahon ng paghahanda ng lupa at binhi.',
  'Planting date starts the crop calendar.':
    'Dito magsisimula ang kalendaryo ng palay.',
  'Calendar completed': 'Tapos na ang kalendaryo',
  'Review harvest records and start a new plan when needed.':
    'Tingnan ang tala ng anihan at gumawa ng bagong plano kung kailangan.',
  'Crop Stage': 'Yugto ng palay',
  'Estimated Crop Calendar': 'Tantyang kalendaryo ng palay',
  'Crop Calendar': 'Kalendaryo ng palay',
  '{method} Calendar': 'Kalendaryo ng {method}',
  'Rice Crop Calendar': 'Kalendaryo ng Palay',
  'Field task checklist': 'Checklist sa bukid',
  'Mark work as done when finished. Saved calendars keep this progress locally for offline review.':
    'Markahan kapag tapos na. Nasa device lang ang progreso para mabuksan kahit offline.',
  'Calendar Summary': 'Buod ng kalendaryo',
  'Activities on {date}': 'Gawain sa {date}',
  'No scheduled activity falls on this date in the current crop calendar view.':
    'Walang nakatakdang gawain sa petsang ito.',
  'Saved Crop Calendar': 'Naka-save na kalendaryo',
  'Edit selected activity': 'I-edit ang napiling gawain',
  'Activity notes': 'Tala ng gawain',
  'Activity Notes': 'Tala ng gawain',
  'Hide activity notes': 'Itago ang tala',
  'Show activity notes': 'Ipakita ang tala',
  'Mark task done': 'Markahan na tapos',
  'Mark task not done': 'Markahan na hindi pa tapos',

  'History Module': 'Mga Naka-save',
  'Review your saved records': 'Tingnan ang mga naka-save',
  'Review saved scan and planner records stored locally on this device.':
    'Tingnan ang mga scan at kalendaryong naka-save sa device.',
  'Scan History': 'Mga scan',
  'Planner History': 'Mga kalendaryo',
  'Saved image checks, top result, confidence scores, and optional farmer notes.':
    'Mga naka-save na scan, resulta, grado ng tugma, at tala.',
  'Clear scan history': 'Burahin ang scan history',
  'Clear all': 'Burahin lahat',
  'Remove all saved scan records from this device?':
    'Burahin lahat ng naka-save na scan sa device na ito?',
  'Non-Plant Image': 'Hindi halaman',
  'Saved local crop calendars are listed here for offline review.':
    'Nandito ang mga naka-save na kalendaryo para mabuksan kahit offline.',
  'Confidence: {confidence}': 'Kasiguraduhan: {confidence}',
  'Scanned: {date}': 'Na-scan: {date}',
  'Tap card to view details': 'Pindutin para makita ang detalye',
  'Tap card to view calendar': 'Pindutin para makita ang kalendaryo',

  'Data Privacy': 'Privacy ng datos',
  'Simple privacy guidance for local app use': 'Simpleng paalala sa privacy',
  'PALAYSCAN is designed to keep most records on the device, while clearly warning users when image checking may involve an external service.':
    'Ginawa ang PALAYSCAN para manatili sa device ang karamihan ng tala, at malinaw na sabihin kung kailan may online na pagsusuri ng larawan.',
  'What stays local': 'Nananatili sa device',
  'What may leave the device': 'Maaaring maipadala online',
  'Recommended user practice': 'Paalala sa user',
  'Do not include faces, personal documents, or unrelated objects in scan photos.':
    'Huwag isama ang mukha, dokumento, o hindi kaugnay na bagay sa larawan.',
  'Only clear rice field images should be submitted for online checking.':
    'Malinaw na larawan lang ng palay o palayan ang i-submit.',
  'Users should avoid uploading personal, unrelated, or sensitive images. PALAYSCAN is intended for clear rice leaf, stem, or field photos only.':
    'Iwasang mag-upload ng personal o sensitibong larawan. Para lang ito sa malinaw na larawan ng palay o palayan.',

  'Scan Disclaimer': 'Paalala sa Scan',
  'Scan results are guide-only': 'Gabay lang ang resulta ng scan',
  'What affects the result': 'Ano ang nakakaapekto sa resulta',
  'How to use scan results': 'Paano gamitin ang resulta',
  'Built-in safeguards': 'Mga paunang check ng app',
  'Online scan support': 'Online na pagsusuri',
  'Treat the best match and top matches as guides only.':
    'Gawing gabay lang ang best match at iba pang tugma.',
  'Use clearer rice images for better checking.':
    'Gumamit ng mas malinaw na larawan para mas maayos ang check.',
  'Do not rely on scan output alone for major farm decisions.':
    'Huwag umasa sa scan lang para sa malalaking desisyon sa bukid.',

  'Planner Disclaimer': 'Paalala sa Kalendaryo',
  'Planner dates are estimated and adjustable':
    'Tantya lang ang petsa at puwedeng baguhin',
  'How to read the planner': 'Paano basahin ang kalendaryo',
  'How to use the calendar responsibly': 'Paano gamitin nang tama',
  'Current scope': 'Hangganan ng app ngayon',
  'Use the planner as a crop calendar guide, not a fixed farm order.':
    'Gamitin ang kalendaryo bilang gabay, hindi utos na kailangang sundin nang eksakto.',
  'Review the schedule when planting conditions change.':
    'Suriin ulit ang iskedyul kapag nagbago ang kondisyon ng tanim.',
  'Edit saved activities locally when field needs differ from the estimate.':
    'Baguhin ang naka-save na gawain kung iba ang kailangan sa bukid.',
};

const filipinoTranslations: Record<string, string> = {
  ...baseFilipinoTranslations,
  ...additionalFilipinoTranslations,
  ...farmerFilipinoTranslations,
};

export type Translator = (key: string, values?: Record<string, string | number>) => string;

type LanguageContextValue = {
  language: AppLanguage;
  ready: boolean;
  setLanguage: (language: AppLanguage) => void;
  t: Translator;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function interpolate(template: string, values?: Record<string, string | number>) {
  if (!values) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_match, token: string) => {
    const value = values[token];
    return value === undefined ? `{${token}}` : String(value);
  });
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>('en');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!active) {
          return;
        }

        if (stored === 'fil' || stored === 'en') {
          setLanguageState(stored);
        }
      })
      .finally(() => {
        if (active) {
          setReady(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const setLanguage = useCallback((nextLanguage: AppLanguage) => {
    setLanguageState(nextLanguage);
    void AsyncStorage.setItem(STORAGE_KEY, nextLanguage);
  }, []);

  const t = useCallback<Translator>(
    (key, values) => {
      if (language === 'fil') {
        const translated = filipinoTranslations[key];
        return interpolate(translated ?? key, values);
      }

      return interpolate(key, values);
    },
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      ready,
      setLanguage,
      t,
    }),
    [language, ready, setLanguage, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useAppLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useAppLanguage must be used within a LanguageProvider.');
  }

  return context;
}
