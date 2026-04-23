---
layout: page
---
<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers,
  VPTeamPageSection
} from 'vitepress/theme'

const coreMembers = [ 
	{
		avatar: 'https://github.com/townwang.png',
		name: 'Townwang',
		title: 'Mobile Developer',
		links: [
		  { icon: 'github', link: 'https://github.com/townwang' },
		  { icon: 'twitter', link: 'https://twitter.com/townwang' }
		]
	},
	{
		avatar: 'https://github.com/icbk.png',
		name: 'icbk',
		title: 'Api Developer',
		links: [
		  { icon: 'github', link: 'https://github.com/icbk' }
		]
	}
  ]
const partners = [	
	
	]
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>Our Team</template>
  </VPTeamPageTitle>
  <VPTeamMembers size="medium" :members="coreMembers" />
  <VPTeamPageSection>
    <template #title>Partners</template>
    <template #members>
      <VPTeamMembers size="small" :members="partners" />
    </template>
  </VPTeamPageSection>
</VPTeamPage>
