import { title } from 'process';
import React from 'react';

const CERTIFICATIONS = [
    {
        title: 'Foundations of Project Management',
        issuer: 'Google',
        url: 'https://www.coursera.org/account/accomplishments/verify/VPIGGNTIVVFV',
    },
    {
        title: 'Product Management First Steps',
        issuer: 'LinkedIn Learning',
        url: 'https://www.linkedin.com/learning/certificates/fa42c50c3180fa409d71ae6ca5015321e87876f0a7184de460af13bcfbc61e37',
    },
    {
        title: 'Project Initiation: Starting a Successful Project',
        issuer: 'Google',
        url: 'https://www.coursera.org/account/accomplishments/verify/M4CYOA9VRSG1',
    },
    {
        title: 'On-Premise Data Visualization Program',
        issuer: 'Coursera',
        url: 'https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/Tata/MyXvBcppsW2FkNYCX_Tata_bm7RavEb24C2zq9as_1691496892553_completion_certificate.pdf'
    },
    {
        title: 'Project Planning: Putting it all together',
        issuer: 'Google',
        url: 'https://www.coursera.org/account/accomplishments/verify/M4CYOA9VRSG1',
    },

    {

        title: 'Corporate Governance',
        issuer: 'Coursera',
        url: 'https://drive.google.com/file/u/2/d/1fgvRLcJKV1NhCTDXjX8DpDQ8AzAgHAzS/view?usp=drive_link'
    },
];

const Certifications: React.FC = () => {
    return (
        <section
            id="certifications"
            className="py-24 px-6 md:px-12 bg-[#F4F4F0] text-[#1C1C1C]"
        >
            {/* Header */}
            <div className="mb-16 max-w-3xl">
                <h2 className="text-4xl md:text-6xl font-serif mb-6">
                    Certifications
                </h2>
                <p className="text-[#666666] leading-relaxed">
                    Formal learning that strengthened my foundations in product thinking,
                    governance, and execution.
                </p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 group-hover:scale-105">
                {CERTIFICATIONS.map((cert) => {
                    const isClickable = Boolean(cert.url);

                    const CardContent = (
                        <>
                            <h3 className="text-xl font-serif mb-2">
                                {cert.title}
                            </h3>
                            <p className="text-sm text-[#777777]">
                                {cert.issuer}
                            </p>
                        </>
                    );

                    return isClickable ? (
                        <a
                            key={cert.title}
                            href={cert.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block rounded-xl border border-[#1C1C1C]/10 p-6 bg-white hover:shadow-lg transition-shadow cursor-pointer"
                        >
                            {CardContent}
                        </a>
                    ) : (
                        <div
                            key={cert.title}
                            className="rounded-xl border border-[#1C1C1C]/10 p-6 bg-white opacity-80"
                        >
                            {CardContent}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default Certifications;
