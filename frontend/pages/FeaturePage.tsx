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
    <FeatureLayout
      title={feature.title}
      subtitle={feature.subtitle}
      description={feature.description}
      bullets={feature.bullets}
      primaryCta={feature.primaryCta}
      secondaryCta={feature.secondaryCta}
    />
  );
};

export default FeaturePage;
