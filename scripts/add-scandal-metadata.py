#!/usr/bin/env python3
"""Tilføjer lastUpdated og krydsreferencer til skandale-JSON-filer."""

import json
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
SCANDALS = BASE / "data" / "scandals"
TODAY = "2026-06-11"
BASELINE = "2026-06-01"

# Eksplicitte krydsreferencer (slug/fil -> felter)
CROSS_REF_UPDATES = {
    "mette-frederiksen/nordic-waste-2025.json": {
        "relatedTopics": ["mink"],
        "otherPoliticians": ["Magnus Heunicke", "Nicolai Wammen", "Morten Bødskov"],
    },
    "mette-frederiksen/groenlandsk-praeventionsskandale-2025.json": {
        "otherPoliticians": ["Magnus Heunicke", "Ane Halsboe-Jørgensen"],
    },
    "mette-frederiksen/bilderberg-moeder-2023-2024.json": {
        "otherPoliticians": [
            "Lars Løkke Rasmussen",
            "Helle Thorning-Schmidt",
            "Anders Fogh Rasmussen",
            "Claus Hjort Frederiksen",
            "Pia Kjærsgaard",
            "Morten Messerschmidt",
        ],
    },
    "ida-auken/groen-omstilling-skattesag-2023.json": {
        "relatedTopics": ["party-funding", "wef"],
        "otherPoliticians": ["Mette Frederiksen", "Uffe Elbæk"],
    },
    "dan-jorgensen/eu-klimakommissaer-2019.json": {
        "relatedTopics": ["wef"],
        "otherPoliticians": ["Helle Thorning-Schmidt", "Jakob Ellemann-Jensen", "Ida Auken"],
    },
    "lars-loekke-rasmussen/skjulte-donorer-2022-2024.json": {
        "relatedTopics": ["party-funding"],
        "otherPoliticians": ["Mette Frederiksen", "Alex Vanopslagh", "Henrik Dahl"],
    },
    "lars-loekke-rasmussen/video-om-penge-2025.json": {
        "relatedTopics": ["party-funding"],
        "otherPoliticians": ["Mette Frederiksen"],
    },
    "pia-kjaersgaard/df-fond-2000erne.json": {
        "relatedTopics": ["party-funding"],
        "otherPoliticians": ["Lars Løkke Rasmussen", "Morten Messerschmidt"],
    },
    "uffe-elbaek/alternativet-oekonomi-2015.json": {
        "relatedTopics": ["party-funding"],
        "otherPoliticians": ["Lars Løkke Rasmussen", "Ida Auken"],
    },
    "pernille-skipper/nato-udtalelser.json": {
        "relatedTopics": ["nato"],
        "otherPoliticians": ["Pelle Dragsted", "Rosa Lund", "Morten Bødskov"],
    },
    "claus-hjort-frederiksen/forsvarsbudget-2018.json": {
        "relatedTopics": ["nato"],
        "otherPoliticians": ["Troels Lund Poulsen", "Morten Bødskov"],
    },
    "troels-lund-poulsen/forsvarsbudget-2024.json": {
        "relatedTopics": ["nato"],
        "otherPoliticians": ["Morten Bødskov", "Claus Hjort Frederiksen"],
    },
    "morten-boedskov/forsvarspolitik-2024.json": {
        "relatedTopics": ["nato"],
        "otherPoliticians": ["Troels Lund Poulsen", "Claus Hjort Frederiksen"],
    },
    "pernille-skipper/eu-holdning.json": {
        "relatedTopics": ["nato"],
        "otherPoliticians": ["Pelle Dragsted", "Morten Messerschmidt"],
    },
    "morten-messerschmidt/eu-fondssvindel-2022.json": {
        "relatedTopics": ["party-funding"],
        "otherPoliticians": ["Lars Løkke Rasmussen", "Pia Kjærsgaard"],
    },
    # --- Bølge 2: Irak, skat, udlændingepolitik, klima, EU, bank, magtmisbrug ---
    "anders-fogh-rasmussen/irak-krigen-2003.json": {
        "relatedTopics": ["iraq-war"],
        "otherPoliticians": ["Claus Hjort Frederiksen", "Pia Kjærsgaard", "Lars Løkke Rasmussen"],
    },
    "helle-thorning-schmidt/skattesag-2014.json": {
        "relatedTopics": ["tax-scandal"],
        "otherPoliticians": ["Claus Hjort Frederiksen", "Mette Frederiksen"],
    },
    "claus-hjort-frederiksen/personlig-skatte-sag.json": {
        "relatedTopics": ["tax-scandal"],
        "otherPoliticians": ["Helle Thorning-Schmidt", "Lars Løkke Rasmussen"],
    },
    "claus-hjort-frederiksen/skat-administration-2010.json": {
        "relatedTopics": ["tax-scandal"],
        "otherPoliticians": ["Helle Thorning-Schmidt", "Anders Fogh Rasmussen"],
    },
    "anders-fogh-rasmussen/skattereform-2007.json": {
        "relatedTopics": ["tax-scandal"],
        "otherPoliticians": ["Claus Hjort Frederiksen", "Lars Løkke Rasmussen"],
    },
    "inger-stoejberg/rigsretssagen-2020-2021.json": {
        "relatedTopics": ["immigration"],
        "otherPoliticians": ["Mette Frederiksen", "Mattias Tesfaye", "Kristian Thulesen Dahl"],
    },
    "inger-stoejberg/stram-udlaendingepolitik-2015-2019.json": {
        "relatedTopics": ["immigration"],
        "otherPoliticians": ["Mette Frederiksen", "Marcus Knuth", "Peter Skaarup"],
    },
    "kristian-thulesen-dahl/udlaendingepolitik-2018.json": {
        "relatedTopics": ["immigration"],
        "otherPoliticians": ["Inger Støjberg", "Pia Kjærsgaard", "Marcus Knuth"],
    },
    "mattias-tesfaye/udlaendingepolitik-2020.json": {
        "relatedTopics": ["immigration"],
        "otherPoliticians": ["Inger Støjberg", "Mette Frederiksen", "Marcus Knuth"],
    },
    "marcus-knuth/udlaendingepolitik-2021.json": {
        "relatedTopics": ["immigration"],
        "otherPoliticians": ["Inger Støjberg", "Mattias Tesfaye", "Peter Skaarup"],
    },
    "peter-skaarup/udlaendingepolitik-2023.json": {
        "relatedTopics": ["immigration"],
        "otherPoliticians": ["Inger Støjberg", "Marcus Knuth", "Kristian Thulesen Dahl"],
    },
    "pia-kjaersgaard/udlaendingepolitik-2001.json": {
        "relatedTopics": ["immigration"],
        "otherPoliticians": ["Inger Støjberg", "Kristian Thulesen Dahl", "Pernille Vermund"],
    },
    "pernille-vermund/udtalelser-om-islam-og-integration.json": {
        "relatedTopics": ["immigration"],
        "otherPoliticians": ["Inger Støjberg", "Pia Kjærsgaard", "Marcus Knuth"],
    },
    "rasmus-stoklund/integrationspolitik-2024.json": {
        "relatedTopics": ["immigration"],
        "otherPoliticians": ["Mattias Tesfaye", "Mette Frederiksen", "Marcus Knuth"],
    },
    "dan-jorgensen/klimapolitik-2023.json": {
        "relatedTopics": ["climate-policy"],
        "otherPoliticians": ["Mette Frederiksen", "Ida Auken", "Morten Østergaard"],
    },
    "morten-oestergaard/klima-loefter-2019.json": {
        "relatedTopics": ["climate-policy"],
        "otherPoliticians": ["Dan Jørgensen", "Mette Frederiksen", "Pia Olsen Dyhr"],
    },
    "mette-abildgaard/klima-minister-2019.json": {
        "relatedTopics": ["climate-policy"],
        "otherPoliticians": ["Dan Jørgensen", "Morten Bødskov", "Mette Frederiksen"],
    },
    "pia-olsen-dyhr/klima-sf-2022.json": {
        "relatedTopics": ["climate-policy"],
        "otherPoliticians": ["Morten Østergaard", "Ida Auken", "Dan Jørgensen"],
    },
    "ida-auken/kvælstof-landbrug-kritik-2011-2014.json": {
        "relatedTopics": ["climate-policy"],
        "otherPoliticians": ["Mette Frederiksen", "Dan Jørgensen", "Pia Olsen Dyhr"],
    },
    "henrik-dahl/eu-parlament-2019.json": {
        "relatedTopics": ["eu-politics"],
        "otherPoliticians": ["Morten Messerschmidt", "Marcus Knuth"],
    },
    "morten-messerschmidt/eu-parlament-aktiviteter.json": {
        "relatedTopics": ["eu-politics"],
        "otherPoliticians": ["Henrik Dahl", "Pia Kjærsgaard"],
    },
    "anders-fogh-rasmussen/bankpakke-2008.json": {
        "relatedTopics": ["bank-crisis"],
        "otherPoliticians": ["Claus Hjort Frederiksen", "Lars Løkke Rasmussen", "Helle Thorning-Schmidt"],
    },
    "helle-thorning-schmidt/oekonomisk-politik-2008-2015.json": {
        "relatedTopics": ["bank-crisis", "welfare-reform"],
        "otherPoliticians": ["Anders Fogh Rasmussen", "Claus Hjort Frederiksen", "Nicolai Wammen"],
    },
    "lars-loekke-rasmussen/hustruens-fyring-2018.json": {
        "relatedTopics": ["corruption-power"],
        "otherPoliticians": ["Mette Frederiksen", "Helle Thorning-Schmidt"],
    },
    "lars-loekke-rasmussen/toejskandalen-2014.json": {
        "relatedTopics": ["corruption-power", "party-funding"],
        "otherPoliticians": ["Helle Thorning-Schmidt", "Anders Fogh Rasmussen"],
    },
    "troels-lund-poulsen/militaer-anskaffelser.json": {
        "relatedTopics": ["nato"],
        "otherPoliticians": ["Morten Bødskov", "Claus Hjort Frederiksen"],
    },
    "helle-thorning-schmidt/velfaerdsreformer-2013.json": {
        "relatedTopics": ["welfare-reform"],
        "otherPoliticians": ["Mette Frederiksen", "Ane Halsboe-Jørgensen", "Magnus Heunicke"],
    },
}


def iter_scandal_files():
    for slug_dir in sorted(SCANDALS.iterdir()):
        if not slug_dir.is_dir():
            continue
        manifest_path = slug_dir / "manifest.json"
        if not manifest_path.exists():
            continue
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        for filename in manifest.get("scandals", []):
            yield slug_dir.name, filename, slug_dir / filename


def merge_fields(data, updates):
    for key, value in updates.items():
        if key == "otherPoliticians":
            existing = data.get("otherPoliticians") or []
            merged = list(dict.fromkeys(existing + value))
            data["otherPoliticians"] = merged
        elif key == "relatedTopics":
            existing = data.get("relatedTopics") or []
            merged = list(dict.fromkeys(existing + value))
            data["relatedTopics"] = merged
        else:
            data[key] = value


def main():
    updated_xref = 0
    updated_dates = 0

    for slug, filename, path in iter_scandal_files():
        if not path.exists():
            print(f"MISSING: {slug}/{filename}")
            continue

        data = json.loads(path.read_text(encoding="utf-8"))
        key = f"{slug}/{filename}"
        changed = False

        if key in CROSS_REF_UPDATES:
            merge_fields(data, CROSS_REF_UPDATES[key])
            data["lastUpdated"] = TODAY
            updated_xref += 1
            changed = True
        elif not data.get("lastUpdated"):
            data["lastUpdated"] = BASELINE
            changed = True

        if changed:
            path.write_text(
                json.dumps(data, ensure_ascii=False, indent=2) + "\n",
                encoding="utf-8",
            )
            updated_dates += 1

    print(f"Krydsreferencer opdateret: {updated_xref}")
    print(f"Filer skrevet (lastUpdated): {updated_dates}")


if __name__ == "__main__":
    main()