import csv, json, ast, re, sys
src = '/tmp/gsm.csv'
out = 'data/csv-devices.json'
want = {'samsung','apple','xiaomi','huawei','honor','oppo','vivo','realme','oneplus','tecno','infinix','itel','zte','nubia','motorola','nokia','lg','google','poco','redmi'}
def clean(v):
    if v is None: return ''
    v = str(v).strip()
    if (v.startswith("b'") and v.endswith("'")) or (v.startswith('b"') and v.endswith('"')):
        try:
            b = ast.literal_eval(v)
            v = b.decode('utf-8', 'replace') if isinstance(b, bytes) else str(b)
        except Exception:
            v = v[2:-1]
    v = v.replace('\\r\\n', ' · ').replace('\\n', ' · ').replace('\r',' · ').replace('\n',' · ')
    v = v.replace('\xa0',' ')
    return re.sub(r'\s+', ' ', v).strip()
rows = []
with open(src, encoding='utf-8', errors='ignore') as f:
    for r in csv.DictReader(f):
        brand = clean(r.get('Brand')).lower().strip()
        if brand not in want: continue
        ann = clean(r.get('Announced'))
        m = re.search(r'(19|20)\d{2}', ann)
        if not m or int(m.group(0)) < 2018: continue
        name = clean(r.get('Model Name'))
        if not name: continue
        if re.search(r'\b(Tab|Tablet|Watch|Band|Pad|Book|Buds|Router)\b', name, re.I): continue
        rec = {k: clean(v) for k, v in r.items() if k}
        rec['_brand_raw'] = brand
        rec['_year'] = int(m.group(0))
        rec['_name'] = name
        rows.append(rec)
json.dump(rows, open(out, 'w'), ensure_ascii=False)
print(len(rows), 'rows')
