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
    <Section border="sides">
      <Container>
        <div className="w-full flex-col">
          <div
            className="flex flex-col items-center text-center mx-auto "
            style={{ marginBottom: '4rem' }}
          >
            <h2 className="text-50-medium">
              Questions, <span className="text-primary">answered</span>.
            </h2>
            <p
              className="text-18-medium text-muted-foreground"
              style={{ marginTop: '1.25rem' }}
            >
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
              <br />
              Lorem Ipsum has been.
            </p>
          </div>
          <FAQAccordion className="w-full" items={faqItems} />
        </div>
      </Container>
    </Section>
  )
}
