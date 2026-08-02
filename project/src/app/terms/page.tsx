import LegalPage from "@/components/layout/LegalPage";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Terms & Conditions",
  description: `The terms on which ${site.name} supplies and installs made-to-measure shutters and blinds.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms & Conditions"
      updated="1 August 2026"
      intro="These are the terms on which we supply and install made-to-measure window coverings. They sit alongside your written quotation, which always takes precedence where the two differ."
      sections={[
        {
          heading: "Quotations",
          body: [
            "Quotations are valid for sixty days from the date of issue and are based on the measurements taken at survey. A quotation is an offer to supply; a contract is formed when you accept it in writing and we acknowledge your order.",
            "Estimates produced by the tools on this website are indicative only. They are not quotations, do not constitute an offer, and are not binding on either party.",
          ],
        },
        {
          heading: "Measurements",
          body: [
            "Where we survey and measure, we take responsibility for the fit. Where you supply your own measurements, we manufacture to those figures and cannot accept a return if they prove incorrect, since every product is made to order.",
            "Buildings move and reveals are rarely perfectly square. We allow for this in manufacture and scribe on site where necessary.",
          ],
        },
        {
          heading: "Payment",
          body: [
            "A deposit of 50% is payable on acceptance of the order, with the balance due on completion of installation. We accept bank transfer, debit and credit card.",
            "Finance is available on orders above £1,000 subject to status, through an authorised credit broker. Full terms are provided before you commit to any agreement.",
          ],
        },
        {
          heading: "Lead times",
          body: [
            "Manufacture typically takes four to six weeks from order. We will give you an expected date at the point of order and keep you informed if it changes. Lead times are estimates and are not of the essence of the contract.",
          ],
        },
        {
          heading: "Cancellation",
          body: [
            "Because every product is made to your measurements, the statutory right to cancel bespoke goods does not apply once manufacture has begun. You may cancel without charge at any point before we place your order into production.",
            "Where an order is placed at your home, you have fourteen days from the date of the contract to cancel under the Consumer Contracts Regulations, unless you have asked us in writing to begin manufacture sooner.",
          ],
        },
        {
          heading: "Guarantee",
          body: [
            "We guarantee parts and workmanship for five years from installation, and shutter frames for ten years. The guarantee covers defects in manufacture and installation. It does not cover accidental damage, misuse, or fair wear and tear.",
            "Your statutory rights under the Consumer Rights Act 2015 are unaffected by anything in these terms.",
          ],
        },
        {
          heading: "Liability",
          body: [
            "We maintain public liability insurance and will make good any damage we cause during installation. Nothing in these terms limits our liability for death or personal injury caused by negligence, or for fraud.",
          ],
        },
        {
          heading: "Contact",
          body: [
            `Questions about these terms should go to ${site.email} or ${site.phone}. ${site.name}, ${site.address.street}, ${site.address.locality}, ${site.address.region} ${site.address.postcode}.`,
          ],
        },
      ]}
    />
  );
}
