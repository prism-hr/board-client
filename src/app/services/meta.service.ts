import {MetaLoader, MetaStaticLoader, PageTitlePositioning} from '@ngx-meta/core';

export function metaFactory(): MetaLoader {
  return new MetaStaticLoader({
    pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
    pageTitleSeparator: ' - ',
    applicationName: 'PRiSM',
    defaults: {
      title: 'PRiSM Page',
      description: 'Student Placement Website',
      'og:image': window.location.protocol + '//' + window.location.host + '/assets/prism-logo.png',
      'og:type': 'website',
      'og:locale': 'en_UK'
    }
  });
}
