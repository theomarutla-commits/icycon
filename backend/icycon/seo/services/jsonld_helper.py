def generate_faq_jsonld(faqs):
    items = []
    for f in faqs:
        items.append({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": {"@type": "Answer", "text": f.answer}
        })
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": items
    }
