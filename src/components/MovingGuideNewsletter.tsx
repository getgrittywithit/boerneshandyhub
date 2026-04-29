'use client';

import SubscribeForm from './SubscribeForm';

export default function MovingGuideNewsletter() {
  return (
    <section className="py-16 bg-gradient-to-br from-boerne-gold/10 to-boerne-gold/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-4xl">&#128230;</span>
              <h2 className="text-2xl font-bold text-gray-900 mt-4">
                Get Your Moving Checklist
              </h2>
              <p className="text-gray-600 mt-2">
                Subscribe for your complete Boerne relocation checklist plus monthly
                tips on settling into Hill Country life.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500">&#10003;</span>
                  Utility setup reminders
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500">&#10003;</span>
                  Homestead exemption deadlines
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500">&#10003;</span>
                  Seasonal home maintenance tips
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500">&#10003;</span>
                  Local events & community news
                </li>
              </ul>
            </div>
            <div>
              <SubscribeForm
                source="moving-guide"
                variant="card"
                headline=""
                description=""
                showNameField={true}
                buttonText="Send My Checklist"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
