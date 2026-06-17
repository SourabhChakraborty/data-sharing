export default function AboutView() {
  return (
    <div className="about-container">
      <div className="about-content">
        <section className="about-section">
          <h2>What is a data sharing agreement?</h2>
          <p>
            When two New York City agencies want to share information with each other — resident
            records, enrollment data, case files — they often formalize it in a Memorandum of
            Understanding (MOU). The MOU specifies what data is shared, for what purpose, who
            can access it, and how long it can be kept. Under Local Law 40 of 2011, NYC agencies
            are required to publish these agreements publicly.
          </p>
          <p>
            For example: the Department of Education shares student enrollment data with the
            Department of Health and Mental Hygiene to identify children eligible for health
            services. The MOU defines exactly which fields travel between the agencies, who is
            authorized to see them, and what happens to the data when the purpose is fulfilled.
          </p>
        </section>

        <section className="about-section">
          <h2>Why it matters</h2>

          <div className="about-reason">
            <h3>Government can work for you, not just about you.</h3>
            <p>
              Data sharing agreements are the infrastructure behind proactive government — the
              kind that enrolls a child in free school lunch when their family applies for housing
              assistance, or flags a senior for energy assistance when they apply for Medicaid.
              Instead of asking residents to prove eligibility separately at every agency, shared
              data lets the city connect people to services they already qualify for.
            </p>
          </div>

          <div className="about-reason">
            <h3>But the same infrastructure cuts both ways.</h3>
            <p>
              Data shared for one purpose can be repurposed in ways residents didn't anticipate
              or consent to. Benefits data has reached law enforcement. Immigration status has
              traveled further than applicants knew. MOUs are the paper trail that shows what
              was agreed to — and what limits, if any, were placed on that use.
            </p>
          </div>

          <div className="about-reason">
            <h3>These agreements are public, but buried.</h3>
            <p>
              Local Law 40 requires publication, but the agreements are scattered across agency
              websites, inconsistently formatted, and hard to search. This tool maps the full
              network in one place so residents, journalists, and advocates can see how city
              agencies are connected — and ask questions about agreements that seem surprising.
            </p>
          </div>
        </section>

        <section className="about-section">
          <h2>Methodology</h2>

          <div className="about-reason">
            <h3>Data collection</h3>
            <p>
              Agreements are collected from NYC agency MOU pages published under Local Law 40
              of 2011. A Node.js scraper crawls each agency's dedicated MOU listing, extracts
              PDF links, and records the title, date, and source URL for every agreement found.
              Each entry links directly to the published government document.
            </p>
          </div>

          <div className="about-reason">
            <h3>AI-generated summaries</h3>
            <p>
              The description, parties, and data types shown for each agreement are generated
              by the Claude AI model (claude-haiku-4-5), not extracted by hand. Most NYC agency
              PDFs are scanned images rather than machine-readable text, so plain text extraction
              yields only signature blocks and headers. Instead, a Python script renders the
              first two pages of each PDF as images and sends them to Claude's vision API, which
              returns a short summary, the parties named in the document, and the categories of
              data being shared.
            </p>
            <p>
              AI-generated content can be incomplete or imprecise. Party names and data types
              are the model's best reading of the document — they have not been independently
              verified. Always consult the linked PDF for authoritative information.
            </p>
          </div>

          <div className="about-reason">
            <h3>Limitations</h3>
            <p>
              Coverage is limited to agencies that maintain public MOU pages and to agreements
              whose PDFs are accessible. Some nyc.gov URLs return errors; those agreements are
              skipped. Dates extracted from older scanned documents can be unreliable — any
              year before 2011 (when the law took effect) should be treated with skepticism.
              The network shows only relationships visible in this dataset, not the complete
              universe of city data-sharing.
            </p>
          </div>
        </section>

        <section className="about-section about-section--meta">
          <p>
            Data sourced from NYC agency MOU pages under{' '}
            <a href="https://www.nyc.gov/site/records/about/agency-mous.page" target="_blank" rel="noreferrer">
              Local Law 40 of 2011
            </a>
            . Each entry links to a published government PDF. Agreement summaries,
            parties, and data types are AI-generated and may be incomplete — always verify
            against the source document.
          </p>
          <p>
            Source code and scraper available on{' '}
            <a href="https://github.com/SourabhChakraborty/data-sharing" target="_blank" rel="noreferrer">
              GitHub
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
