import React from 'react';
import { Link, useParams } from 'react-router-dom';
import FeatureLayout from '../components/FeatureLayout';
import { featureBySlug } from '../lib/features';

const FeaturePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const feature = slug ? featureBySlug[slug] : undefined;

  if (!feature) {
    return (
      <div className="pt-24 pb-16 px-4 bg-slate-50 dark:bg-icy-dark min-h-screen text-center">
        <div className="max-w-xl mx-auto space-y-4">
          <h1 className="text-3xl font-bold text-icy-dark dark:text-white">Feature not found</h1>
          <p className="text-gray-600 dark:text-gray-300">
            The feature you are looking for is unavailable. Head back and pick another service.
          </p>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 bg-icy-main text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-icy-main/25 hover:bg-blue-600 transition-colors"
          >
            Back to services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <FeatureLayout
        title={feature.title}
        subtitle={feature.subtitle}
        description={feature.description}
        bullets={feature.bullets}
        primaryCta={feature.primaryCta}
        secondaryCta={feature.secondaryCta}
      />
      <div className="bg-slate-50 dark:bg-icy-dark pb-12 px-4">
        <div className="w-[90%] lg:w-[80%] mx-auto">
          <div className="bg-white dark:bg-[#001c4d] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Ready to add data for this feature?</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{feature.title} data console</h3>
            </div>
            <Link
              to={`/features/${feature.slug}/data`}
              className="bg-icy-main text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              Open data page
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeaturePage;
