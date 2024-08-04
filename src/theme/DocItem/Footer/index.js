import Course from './course';
import EditThisPage from "@theme/EditThisPage";
import LastUpdated from "@theme/LastUpdated";
import React from "react";
import SignUp from './signup';
import TagsListInline from "@theme/TagsListInline";
import { ThemeClassNames } from "@docusaurus/theme-common";
import clsx from "clsx";
import styles from "./styles.module.css";
import { useDoc } from "@docusaurus/theme-common/internal";

const courses = [
{
  name: 'Intro to Prompt Engineering',
  desc: 'Learn about the basics of Prompt Engineering, and how to effectively communicate with AI.',
  isPro: true,
  percent: 30,
  count: 12,
  url: 'https://learn-prompting.webflow.io/courses/intro-to-prompt-engineering',
  src: "https://assets-global.website-files.com/655b6730173650f3f66a0f98/655e35962450a3b5e5be1276_A%20blue%20and%20pink%20abstract%20background.jpg",
  srcset: "",
},
{
  name: 'Advanced Prompt Engineering',
  desc: "Learn how to craft Complex and Efficient Prompts for Sophisticated AI Applications.",
  special: true,
  isPro: true,
  percent: 100,
  count: 14,
  url: 'https://learn-prompting.webflow.io/courses/advanced-prompt-engineering',
  src: "https://assets-global.website-files.com/655b6730173650f3f66a0f98/655d3c311a302329f920daa4_Abstract%20Blue%20Pink%20Wavy%20(2)..jpg",
  srcset: "",
},
]



function TagsRow(props) {
  return (
    <div
      className={clsx(
        ThemeClassNames.docs.docFooterTagsRow,
        "row margin-bottom--sm"
      )}
    >
      <div className="col">
        <TagsListInline {...props} />
      </div>
    </div>
  );
}

function EditMetaRow({
  editUrl,
  lastUpdatedAt,
  lastUpdatedBy,
  formattedLastUpdatedAt,
}) {
  return (
    <div className={clsx(ThemeClassNames.docs.docFooterEditMetaRow, "row")}>
      <div className="col">{editUrl && <EditThisPage editUrl={editUrl} />}</div>

      <div className={clsx("col", styles.lastUpdated)}>
        {(lastUpdatedAt || lastUpdatedBy) && (
          <LastUpdated
            lastUpdatedAt={lastUpdatedAt}
            formattedLastUpdatedAt={formattedLastUpdatedAt}
            lastUpdatedBy={lastUpdatedBy}
          />
        )}
      </div>
    </div>
  );
}

const securityWords = ['hack', 'security', 'inject', 'safety']

export default function DocItemFooter() {
  const { metadata, ...rest } = useDoc();
  console.log( metadata.description, rest.toc.map(t => t.value))
  const isSecurity = [...rest.toc.map(t => t?.value || ''), metadata.description].some(t => securityWords.some(w => t.toLowerCase().includes(w)))
  const {
    editUrl,
    lastUpdatedAt,
    formattedLastUpdatedAt,
    lastUpdatedBy,
    tags,
  } = metadata;
  const canDisplayTagsRow = tags.length > 0;
  const canDisplayEditMetaRow = !!(editUrl || lastUpdatedAt || lastUpdatedBy);
  const canDisplayFooter = canDisplayTagsRow || canDisplayEditMetaRow;
  if (!canDisplayFooter) {
    return null;
  }
  return (
    <footer
      className={clsx(ThemeClassNames.docs.docFooter, "docusaurus-mt-lg")}
    >

      <SignUp/>
      {canDisplayTagsRow && <TagsRow tags={tags} />}
      {canDisplayEditMetaRow && (
        <EditMetaRow
          editUrl={editUrl}
          lastUpdatedAt={lastUpdatedAt}
          lastUpdatedBy={lastUpdatedBy}
          formattedLastUpdatedAt={formattedLastUpdatedAt}
        />
      )}

    </footer>
  );
}
