import QuoteForm from '../components/QuoteForm'

export default function Contact() {
  return (
    <section className="container py-12">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-3">Request a Custom Quote</h2>
          <QuoteForm context="Contact page" />
        </div>
        <div className="space-y-3 text-slate-700 dark:text-slate-300">
          <p><strong>Phone:</strong> 0721248369</p>
          <p><strong>Location:</strong> Tumaini House, Moi Avenue, 4th Flr Rm 411</p>
          <div className="aspect-video rounded-md overflow-hidden border border-slate-200 dark:border-slate-800">
            <iframe title="map" className="w-full h-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.146!2d36.816!3d-1.283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0:0x0!2z!5e0!3m2!1sen!2ske!4v0000000000"></iframe>
          </div>
        </div>
      </div>
    </section>
  )
}
