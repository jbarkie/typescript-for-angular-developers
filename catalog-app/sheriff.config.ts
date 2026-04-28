import type { SheriffConfig } from '@softarc/sheriff-core';
import { sameTag } from '@softarc/sheriff-core';

// Sheriff enforces architectural boundaries between feature areas and shared code.
// This app has exactly one feature ('catalog') plus shared utilities, so the rules
// are deliberately simple — they'll grow with the domain.
//
// TODO(day-1-pm-sheriff-demo): add a second fictional feature and show how Sheriff
// refuses cross-feature imports. Then show what a shared module is for.

export const config: SheriffConfig = {
  autoTagging: true,
  enableBarrelLess: true,
  modules: {
    'src/app/areas/<feature>': ['domain:<feature>', 'type:feature'],
    'src/app/shared': ['type:shared'],
    'src/app/__mocks__': ['type:mocks'],
    'src/app': ['type:app'],
  },
  depRules: {
    'type:feature': [sameTag, 'type:shared'],
    'type:app': ['type:feature', 'type:shared'],
    'type:shared': [sameTag],
    'type:mocks': ['type:feature', 'type:shared'],
    'domain:*': [sameTag, 'type:shared'],
    root: ['type:app'],
  },
};
