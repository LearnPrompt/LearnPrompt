# Checksum manifest

本表由 `verifier.sh` 根据工作树外 raw checksum 生成。所有路径都只保留逻辑名，不含用户绝对路径。

| Stage | `docs/link.md` | `sentinel.txt` | `.env` |
| --- | --- | --- | --- |
| initial | db929416332e9768f42e87204c795853de83b49cf3ed4b41bd10fa66649e127a | dcc13db814d8b2bacfbf2d46c80d22ee3ebef8dcdfa99b8664b5d5ec4b8efce8 | fa5c36913e9238fdc0696c296cfa186f34ca92f24d271eac1efd1dd5f7bc2f87 |
| probe1 | db929416332e9768f42e87204c795853de83b49cf3ed4b41bd10fa66649e127a | dcc13db814d8b2bacfbf2d46c80d22ee3ebef8dcdfa99b8664b5d5ec4b8efce8 | fa5c36913e9238fdc0696c296cfa186f34ca92f24d271eac1efd1dd5f7bc2f87 |
| probe2 | 828861b49739975111aeb4d41056c3c8cef4ef2049fe42ca45ead76bbdbd231c | dcc13db814d8b2bacfbf2d46c80d22ee3ebef8dcdfa99b8664b5d5ec4b8efce8 | fa5c36913e9238fdc0696c296cfa186f34ca92f24d271eac1efd1dd5f7bc2f87 |
| probe3 | a9b97059dfcb19c8a0477f015147d833e554c32cbf7db0b82e79f94633b8b6e2 | dcc13db814d8b2bacfbf2d46c80d22ee3ebef8dcdfa99b8664b5d5ec4b8efce8 | fa5c36913e9238fdc0696c296cfa186f34ca92f24d271eac1efd1dd5f7bc2f87 |

## Derived checks

- `docs/link.md`：`initial == probe1`、`probe2 != probe1`、`probe3 != probe2`
- `sentinel.txt`：`initial == probe1 == probe2 == probe3`
- `.env`：`initial == probe1 == probe2 == probe3`
