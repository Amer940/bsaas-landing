import { FAQAccordion } from '../ui/faq-item'
import { Container } from '../container'
import { Section } from '../wrappers/section-wrapper'

const faqItems = [
  {
    title: 'How quickly can I start taking bookings?',
    answer:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    title: 'What is a referral code, and how does it work?',
    answer:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    title: 'Does the calendar sync with my existing tools?',
    answer:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    title: "What happens if a client doesn't show up?",
    answer:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    title: 'Is Faded available on Android?',
    answer:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
]

export function FAQSection() {
  return (
    <div className="w-screen px-2 mx-auto max-w-350">
      <Section border="sides" className="bg-white">
        <Container>
          <div className="w-full flex-col">
            <div className="flex flex-col items-center text-center mx-auto md:mb-16 mb-8">
              <h2 className="md:text-50-medium text-[36px] leading-[110%] font-medium">
                Questions, <span className="text-primary">answered</span>.
              </h2>
              <p className="md:text-18-medium text-[14px] font-normal text-muted-foreground mt-5 md:max-w-157 max-w-71">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been.
              </p>
            </div>
            <FAQAccordion className="w-full" items={faqItems} />
          </div>
        </Container>
      </Section>
    </div>
  )
}
