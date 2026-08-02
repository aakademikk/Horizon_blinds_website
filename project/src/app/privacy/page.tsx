import LegalPage from "@/components/layout/LegalPage";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses and protects the personal information you give us.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      updated="1 August 2026"
      intro={`This policy explains what we do with the information you give us — through the enquiry form, over the phone, or during a survey. It is written to be read, not to be survived.`}
      sections={[
        {
          heading: "Who we are",
          body: [
            `${site.name} of ${site.address.street}, ${site.address.locality}, ${site.address.region} ${site.address.postcode} is the data controller for the information described here. You can reach us at ${site.email} or on ${site.phone}.`,
          ],
        },
        {
          heading: "What we collect",
          body: [
            "When you complete an enquiry form we collect your name, email address, telephone number, postcode, the area and room you have told us about, the product you are interested in, the approximate number of windows, your preferred appointment time and anything you write in the message field.",
            "Our server also records the date and time of the enquiry, the page you submitted it from, and a shortened version of your browser's user-agent string. This helps us spot automated abuse of the form.",
            "If you subscribe to our occasional letters we collect only your email address.",
          ],
        },
        {
          heading: "Why we use it",
          body: [
            "To respond to your enquiry, arrange and carry out a survey, prepare a quotation, and fulfil an order if you decide to place one. This is necessary for taking steps at your request before entering into a contract, and for the performance of that contract.",
            "To keep records of work carried out, which we need for our guarantee and for accounting purposes. This is a legal obligation and a legitimate interest.",
            "To send you the newsletter, where you have asked for it. You can unsubscribe at any time using the link in any letter.",
          ],
        },
        {
          heading: "Who we share it with",
          body: [
            "We do not sell your details, and we do not share them for anyone else's marketing.",
            "Enquiries are stored in our hosted database and may be passed to the workflow tools we use to alert the team to a new enquiry. Manufacturing partners receive only the measurements and specification needed to build your order — never your contact details beyond what is required for delivery.",
          ],
        },
        {
          heading: "How long we keep it",
          body: [
            "Enquiries that do not lead to an order are deleted after twenty-four months. Records relating to completed work are kept for the life of the guarantee plus six years, which is the period we are required to retain financial records.",
          ],
        },
        {
          heading: "Your rights",
          body: [
            "You have the right to ask for a copy of the information we hold about you, to have it corrected, to have it deleted where we no longer need it, to restrict or object to how we use it, and to receive it in a portable format.",
            `To exercise any of these, email ${site.email} and we will respond within one month. If you are unhappy with how we have handled your information you can complain to the Information Commissioner's Office at ico.org.uk.`,
          ],
        },
        {
          heading: "Cookies",
          body: [
            "This website does not set advertising or tracking cookies. Your browser's local storage is used for one purpose only: to keep a draft of a partly completed enquiry form so you do not have to retype it. That draft never leaves your device until you press send, and it is cleared once the form is submitted.",
          ],
        },
      ]}
    />
  );
}
