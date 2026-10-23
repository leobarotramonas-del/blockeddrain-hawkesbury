import { areas, services, site } from './site';

export interface FaqItem { question: string; answer: string; }
export const faqSchema = (items: readonly FaqItem[]) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) });

export const serviceFaqs = Object.fromEntries(services.map((service) => [service.slug, [
  { question: `What are the signs I may need ${service.name.toLowerCase()}?`, answer: `${service.signs.join(', ')} can indicate this type of drainage problem. Stop using affected fixtures if water is rising and call if wastewater is escaping.` },
  { question: `What commonly causes this drain problem?`, answer: `${service.causes.join(', ')} are common possibilities, but the cause needs to be assessed from the property, access points and pipe condition.` },
  { question: 'Will a plumber use a drain camera?', answer: 'CCTV is useful when the line is accessible and clear enough to see the pipe wall. Heavy obstruction may need clearing first, and not every short fixture blockage requires a camera.' },
  { question: 'Is high-pressure water jetting always the right fix?', answer: 'No. Jetting is selected only when it suits the pipe, access and obstruction. A collapsed pipe or unsuitable connection may require another clearing method or a repair.' },
  { question: 'Why should a professional clear the blockage?', answer: 'A licensed drainage professional can identify safe access, select equipment for the pipe condition, manage contaminated water and recognise evidence that a temporary clearing has not fixed the underlying defect.' },
  { question: 'How much will blocked-drain work cost?', answer: 'Cost depends on access, obstruction, equipment, time and whether pipe damage is found. The proposed initial work and applicable charges should be explained before agreed work proceeds.' },
  { question: 'Do you provide urgent help in the Hawkesbury?', answer: `Yes. Urgent calls are taken ${site.hours}. Attendance depends on technician availability, safe access and the type of overflow or blockage.` },
  { question: 'Can you repair the pipe if it is damaged?', answer: 'Yes. If evidence shows a structural defect, suitable repair options can be discussed. The scope depends on location, depth, pipe material, surrounding surfaces and access.' },
]])) as Record<string, FaqItem[]>;

export const pageFaqs = {
  services: [
    { question: 'What blocked-drain services do you provide?', answer: 'Services include urgent clearing, sewer and stormwater blockages, blocked fixtures, high-pressure jetting, CCTV inspection, tree-root removal and targeted drain repairs.' },
    { question: 'Are you licensed for drainage work in NSW?', answer: `Yes. Regulated work is performed under NSW contractor licence ${site.licence}.` },
    { question: 'Do you attend homes, acreage and businesses?', answer: 'Yes. Tell us about driveways, gates, parking, strata approval, site induction or long access routes when booking.' },
    { question: 'Do you guarantee that jetting will permanently fix a blockage?', answer: 'No method is presented as a permanent fix before diagnosis. Jetting can clear suitable obstructions, while roots, breaks, offsets or collapse may also require repair.' },
    { question: 'How do I choose the right service?', answer: 'You do not need to diagnose the fault. Call with the symptoms, affected fixtures and suburb, and the team can help identify the practical first step.' },
  ],
  serviceAreas: [
    { question: 'Which Hawkesbury locations do you cover?', answer: `Core pages cover ${areas.map((area) => area.name).join(', ')} and nearby communities. Exact attendance is confirmed from the address.` },
    { question: 'Do you have an office in every listed suburb?', answer: 'No. This is a mobile Hawkesbury drainage service. Local pages describe coverage and property considerations; they do not represent separate offices.' },
    { question: 'Can you attend acreage and semi-rural properties?', answer: 'Yes, subject to access and availability. Mention long driveways, locked gates, animals, private systems and distant drainage access points when calling.' },
    { question: 'Are urgent calls available throughout the service area?', answer: 'Urgent calls are taken 24/7. Response depends on technician availability, road and property access, the fault and site safety.' },
    { question: 'How do I confirm my address?', answer: `Call ${site.phoneDisplay} with the full street address, property type and symptoms.` },
  ],
  about: [
    { question: 'Who provides the Hawkesbury blocked-drain service?', answer: `${site.name} is a dedicated blocked-drain service from ${site.operator}. Regulated work is performed under NSW contractor licence ${site.licence}.` },
    { question: 'What makes the service drainage-focused?', answer: 'Antons Blocked Drains Hawkesbury focuses on drain clearing, CCTV inspection, water jetting, root removal and pipe repairs. Our team investigates the cause and explains the work before it proceeds.' },
    { question: 'Are the photos real work?', answer: 'Yes. The site uses supplied vehicle, technician, camera, jetting, excavation and drainage-repair images from real work rather than stock tradie photography.' },
    { question: 'Can I call outside business hours?', answer: 'Yes. Urgent drain calls are taken 24 hours a day, 7 days a week.' },
  ],
  contact: [
    { question: 'What number should I call?', answer: `Call ${site.phoneDisplay} for blocked-drain help in the Hawkesbury.` },
    { question: 'What information should I have ready?', answer: 'Share the full address, affected fixtures, when the problem began, whether water or sewage is overflowing, and any access limitations.' },
    { question: 'Can I send photos or video?', answer: 'Photos of the overflow, access point or affected fixture may help, provided you can take them without entering contaminated water or another unsafe area.' },
    { question: 'Can you quote without seeing the drain?', answer: 'The initial approach may be discussed by phone, but access, equipment and hidden pipe condition often require inspection before an accurate repair scope is possible.' },
  ],
};
